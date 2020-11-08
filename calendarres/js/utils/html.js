function createEl(options) {
  let type = 'div';
  if (options.type) type = options.type;
  let el = document.createElement(type);

  if (options.id) el.setAttribute('id', options.id);
  if (options.className) el.className = options.className;
  if (options.innerHTML) el.innerHTML = options.innerHTML;
  if (options.child) el.appendChild(options.child)

  if (options.attributes) {
    for (var a of options.attributes) {
      el.setAttribute(a[0], a[1])
    }
  }
  return el;
}