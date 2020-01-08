
function reset() {
  fetch(urlProxyReset)
  .then(console.log('New shift succeeded'))
  .catch(console.log('New shift failed'))
}