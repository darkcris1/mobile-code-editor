(async function() {
	try {
		await aceLoaded();
	} catch (e) {
		console.log(e)
	}
	function loadAce() {
		function aceMixin(config) {
			const {
				mode = "html",
				parent
			} = config;
			const editor = ace.edit(parent);
			const em = require("ace/ext/emmet");
			editor.session.setMode(`ace/mode/${mode}`)
			editor.session.setTabSize(3)
			editor.setOptions({
				fontSize: "0.7rem",
				enableBasicAutocompletion: true,
				enableLiveAutocompletion: true,
				enableSnippets: true,
				enableEmmet: true,
				theme: "ace/theme/monokai",
				useSoftTabs: false,
			});
			//console.log(editor)
			editor.commands.removeCommand("showSettingsMenu")
			return editor;
		}
		const editor = aceMixin({
			parent: "editorHtml",
			mode: "html"
		});
		const editorC = aceMixin({
			parent: "editorCSS",
			mode: "css"
		});
		const editorJ = aceMixin({
			parent: "editorJS",
			mode: "javascript",
		});
		editor.setValue("<!-- Press Tab -->\n!", 1)
		editorC.setValue("* {\n box-sizing: border-box;\n}", 1)
		let selectedEditor = editor;
		const pk = document.querySelector("#picker");
		let textarea = selectedEditor.textInput.getElement();

		pk.addEventListener("click", function() {
			const picker = new Picker({
				parent: pk,
				color: selectedEditor.getSelectedText() || "gold",
				editor: true,
			});
			picker.setColor(selectedEditor.getSelectedText());
			picker.settings.popup = "top";
			picker.destroy()
			picker.show();
			picker.onDone = function (color) {
				selectedEditor.insert(color.printHex())
			}
		});
		ace.config.loadModule('ace/snippets/snippets', function () {
			const snippetManager = ace.require('ace/snippets').snippetManager;
			document.body.onclick = function() {
				ace.config.loadModule('ace/snippets/javascript', function(m) {
					if (m) {
						m.snippets.push(...snippets);
						snippetManager.register(m.snippets, m.scope);
					}
				});
				document.body.onclick = null;
			}
		});

		let isFocused = false;
		const evalFocus = function() {
			if (isFocused) {
				selectedEditor.focus();
			}
		}
		function updateFocus() {
			isFocused = true
		}
		const oldHeight = window.innerHeight;
		window.onresize = function () {
			if (this.innerHeight === oldHeight) {
				isFocused = false;
			}
		}

		function changeEditor(id) {
			const output = document.querySelector(".output")
			if (output) output.remove();
			selectedEditor.off("focus", updateFocus)
			switch (id) {
				case "editorCSS":
					selectedEditor = editorC;
					swapChildren(id);
					break;
				case "editorHtml":
					selectedEditor = editor;
					swapChildren(id);
					break;
				case "editorJS":
					selectedEditor = editorJ;
					swapChildren(id);
					break;
				default:
					updateDocument();
					break;
			}
			selectedEditor.on("focus", updateFocus)
		}
		const nav = document.querySelectorAll("nav a")
		nav.forEach(child=> {
			child.addEventListener("click", function () {
				if (this === nav[nav.length - 1]) {
					updateDocument();
				}
				document.querySelector(".active").classList.remove("active");
				this.classList.add("active");
				changeEditor(child.dataset.id)
				textarea = selectedEditor.textInput.getElement()
			});
		})
		document.querySelector(".preview").onclick = () => document.querySelector("#ot").click();

		function toolsAction(id) {
			switch (id) {
				case 'tab':
					simulateKey({
						element: textarea,
						keyCode: 9
					})
					break;
				case 'undo':
					selectedEditor.undo();
					break;
				case 'redo':
					selectedEditor.redo();
					break;
				case 'copyLinesUp':
					selectedEditor.copyLinesUp();
					break;
				case 'copyLinesDown':
					selectedEditor.copyLinesDown();
					break;
				case 'moveDown':
					selectedEditor.moveLinesDown();
					break;
				case 'moveUp':
					selectedEditor.moveLinesUp();
					break;
				case 'beautify':
					const prettier = require("ace/ext/beautify");
					prettier.beautify(selectedEditor.getSession());
					break;
				case 'search':
					simulateKey({
						element: textarea,
						keyCode: 72, ctrlKey: true,
					});
					break;
				case 'menu':
					simulateKey({
						element: textarea,
						keyCode: 112
					});
					break;
				case 'arrowUp':
					simulateKey({
						element: textarea,
						keyCode: 38
					});
					break;
				case 'arrowDown':
					simulateKey({
						element: textarea,
						keyCode: 40
					});
					break;
				case 'arrowLeft':
					simulateKey({
						element: textarea,
						keyCode: 37
					});
					break;
				case 'arrowRight':
					simulateKey({
						keyCode: 39,
						element: textarea,
					});
					break;
				case 'selectWord':
					simulateKey({
						element: textarea,
						keyCode: 39, ctrlKey: true, altKey: true
					});
					break;
			}
			evalFocus()
		}
		selectedEditor.on("focus", updateFocus)
		document.querySelectorAll((".tools button")).forEach(btn=> {
			if (btn.id === "picker") return;
			btn.addEventListener("click", function() {
				toolsAction(this.id);
			})
		})
		function updateDocument() {
			const output = document.createElement("iframe");
			document.body.appendChild(output)
			output.className = "output";
			output.frameBorder = 0;
			const frame = output.contentDocument;
			console.log(output)
			const newFrame = frame.open();
			const erudaScript = document.createElement("script");
			const erudaInit = document.createElement("script")
			erudaScript.defer = !0;
			erudaInit.defer = !0;
			erudaScript.src = "https://cdnjs.cloudflare.com/ajax/libs/eruda/2.2.0/eruda.js";
			erudaInit.innerHTML = `eruda.init({
					tool: ["console","elements","network","resources"],
					defaults: {
					displaySize: 60
			}});
			eruda.remove("settings")`;
			newFrame.write("<head></head>")
			newFrame.write("<body></body>")
			newFrame.body.appendChild(erudaScript);
			erudaScript.onload = function(e) {
				newFrame.head.appendChild(erudaInit);
				newFrame.head.innerHTML += `<style>${editorC.getValue()}</style>`;
				newFrame.write(editor.getValue())
				newFrame.write(`<script>${editorJ.getValue()}<\/script>`)
				frame.close();
			}
		}
	}
	
	if (typeof ace !== "undefined") {
		loadAce();
		setTimeout(function() {
			document.body.removeChild(document.querySelector(".loading-screen"))
		},	1000);
	} else {
		document.querySelector(".loading-screen h2").innerHTML = "You are offline 😪";
	}
		
}())