document
.getElementById("btn-collapse")
.addEventListener("click", collapseToolbar);

document
.getElementById("panel-close-stops")
.addEventListener("click", closeFlowPanel);

document
.getElementById("panel-close-routes")
.addEventListener("click", closeFlowPanel);

document
.getElementById("panel-close-closestFacility")
.addEventListener("click", closeFlowPanel);

document
.getElementById("panel-close-settings")
.addEventListener("click", closeFlowPanel);

document
.getElementById('btn-show-stops')
.addEventListener('click', openFlowPanel)

document
.getElementById('btn-show-routes')
.addEventListener('click', openFlowPanel)

document
.getElementById('btn-show-closestFacility')
.addEventListener('click', openFlowPanel)

document
.getElementById('btn-show-settings')
.addEventListener('click', openFlowPanel)



function collapseToolbar(event) {
  let emnts = document.getElementsByClassName("collapsable");
  let collapse = true; 

  for (i = 0; i < emnts.length; i++) {
    let c = emnts[i];
    if (c.style.display === "") {
      c.style.display = "none";
      collapse = true;
    } else {
      c.style.display = "";
      collapse = false;
    }
  }

  if (collapse) {
    document.getElementById("icon-collapse").classList.remove("icon-ui-expand");
    document.getElementById("icon-collapse").classList.add("icon-ui-collapse");
    document.getElementById("action-bar").style.flex = "0 0 3em";
  
  } else {
    document.getElementById("icon-collapse").classList.remove("icon-ui-collapse");
    document.getElementById("icon-collapse").classList.add("icon-ui-expand");
    document.getElementById("action-bar").style.flex = "0 0 8em";
  }    
}

function closeFlowPanel(event) {
  let emnts = document.getElementsByClassName("flow-panel");
  for (i = 0; i < emnts.length; i++) {
    let c = emnts[i];
    c.style.display = "none";
  }
}

function openFlowPanel(event) {
  closeFlowPanel();
  let panelId = event.currentTarget.id;
  panelId = 'panel' + panelId.substr(panelId.lastIndexOf('-'));
  let panel = document.getElementById(panelId);
  panel.style.display = 'flex'; 
}


