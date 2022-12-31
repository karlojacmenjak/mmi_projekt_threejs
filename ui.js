
class ButtonSelectionGroup {

  constructor() {
    this.elements = [];
    this.selected = undefined;
  }

  addButton(id, onClick) {

    let element = document.querySelector(id);
    element.addEventListener('click', (e) => {

      if(this.selected != undefined) this.selected.classList.remove('selected');
      
      this.selected = element;
      this.selected.classList.add('selected');

    });


  }

}

let objSelectionGroup = new ButtonSelectionGroup();

objSelectionGroup.addButton('#btn-cylinder');
objSelectionGroup.addButton('#btn-cone');
objSelectionGroup.addButton('#btn-sphere');
objSelectionGroup.addButton('#btn-earth');







