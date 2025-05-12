export class Player {
  constructor(name, id = 0, color = 0x00ff00, shape, team = 1) {
    this.name = name;
    this.id = id;
    this.color = color;
    this.team = team;
    this.selectedShape = shape

    this.selectedUnits = []; // units this player currently has selected
    this.controlledUnits = []; // all units this player owns
  }

  selectUnits(units) {
    this.selectedUnits = units;
  }

  addUnit(unit) {
    this.controlledUnits.push(unit);
  }

  removeUnit(unit) {
    this.controlledUnits = this.controlledUnits.filter(u => u !== unit);
  }

  clearSelection() {
    this.selectedUnits = [];
  }
}
