(function() {
	const scripts = [
		"https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ext-emmet.min.js",
		"https://cloud9ide.github.io/emmet-core/emmet.js",
		"https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ext-language_tools.min.js",
		"https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ext-beautify_tools.min.js",
		"https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/snippets/javascript.min.js",
		"https://unpkg.com/vanilla-picker@2",
		"js/fontawesome.js"
	]
	const body = document.body;

	function aceScript() {
		return new Promise((resolve, reject)=> {
			
			if (!navigator.onLine) reject("No Internet");
			
			const jsScript = document.createElement("script");
			jsScript.src = "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.js";
			body.appendChild(jsScript);
			jsScript.onload = function(e) {
				scripts.forEach(script=> {
					const jsScript = document.createElement("script");
					jsScript.src = script;
					jsScript.async = true;
					body.appendChild(jsScript);
				})

				window.onload = ()=> resolve("Success");
			}
		})
	}
	window.aceLoaded = aceScript;
}())