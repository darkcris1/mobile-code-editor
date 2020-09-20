function swapChildren(id) {
	const child = document.getElementById(id);
	const parent = child.parentElement;
	if (parent.firstChild === child) return;
	parent.insertBefore(child, parent.firstChild)
}