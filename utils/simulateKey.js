function simulateKey (option) {
	const {
		keyCode,
		type,
		altKey,
		shiftKey,
		ctrlKey,
		element
	} = option;
	const evtName = typeof type === "string" ? "key" + type: "keydown";
	const event = document.createEvent("HTMLEvents");
	event.initEvent(evtName, true, false);
	event.keyCode = keyCode;
	event.altKey = !!altKey;
	event.shiftKey = !!shiftKey;
	event.ctrlKey = !!ctrlKey;
	element.dispatchEvent(event);
}