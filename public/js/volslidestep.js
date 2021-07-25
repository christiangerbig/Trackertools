// Handler for VolSlideStep
const handleVolSlideStep = () => {
  // ---------- Global ---------
  const definedTics = 6;
  const definedInstrumentVolume = 64;
  const definedUnits = 1;
  const maxVolumeSlideCommands = 64;
  const maxFinevolumeSlideUnits = 15; // = hex F
  const definedVolumeslideTooltipText = "Number of commands ranges from 1 to 64";
  const definedFinevolumeSlideTooltipText = "Number of units ranges from hex 1 to F";
  const volumeSlideTooltipErrorText = "Number of commands is greater than 64";
  const finevolumeSlideTooltipErrorText = "Number of units is greater than hex F";
  const outputErrorText = "**";

  const elements = {
    ticsButton: document.querySelector("#ticsButton"),
    instrumentVolumeButton: document.querySelector("#instrumentVolumeButton"),
    unitsButton: document.querySelector("#unitsButton"),
    finevolumeSlideContainer: document.querySelector("#finevolumeSlideContainer"),
    finevolumeSlideCheckbox: document.querySelector("#finevolumeSlideCheckbox"),
    commandsResult: document.querySelector("#commandsResult"),
    unitsResult: document.querySelector("#unitsResult"),
    resetButton: document.querySelector("#resetButton"),
    groupChange: document.querySelectorAll(".groupChange")
  };

  const calculation = {
    volumeSlideCommands: 0,
    finevolumeSlideCommands: 0,
    finevolumeSlideUnits: 0,
    commandsToggle: 0,
    tics: definedTics,
    instrumentVolume: definedInstrumentVolume,
    units: definedUnits
  };

  const {ticsButton, instrumentVolumeButton, unitsButton, finevolumeSlideContainer, finevolumeSlideCheckbox, commandsResult, unitsResult, resetButton, groupChange} = elements;

  // Set default text color if it as red
  const setDefaultTextColor = () => {
    if (commandsResult.classList.contains("text-danger") || unitsResult.classList.contains("text-danger")) {
      commandsResult.classList.remove("text-danger");
      commandsResult.classList.add("textColored");
      unitsResult.classList.remove("text-danger");
      unitsResult.classList.add("textColored");
    }
  }

  // Check state of checkbox and show/hide fine volume slide container
  const checkFinevolume = () => {
    if (finevolumeSlideCheckbox.checked) {
      calculation.commandsToggle = calculation.finevolumeSlideCommands;
      finevolumeSlideContainer.classList.remove("d-none");
    }
    else {
      calculation.commandsToggle = calculation.volumeSlideCommands;
      finevolumeSlideContainer.classList.add("d-none");
    }
  }

  // Check checkbox state and show/hide fine volume slide
  const handleCheckboxState = () => {
    checkFinevolume();
    let [volumeSlideTooltipText, finevolumeSlideTooltipText] = [definedVolumeslideTooltipText, definedFinevolumeSlideTooltipText];
    if ((calculation.commandsToggle <= maxVolumeSlideCommands) && (calculation.finevolumeSlideUnits <= maxFinevolumeSlideUnits)) {
      calculation.finevolumeSlideUnits = calculation.finevolumeSlideUnits;
    }			
    else {
      calculation.commandsToggle = outputErrorText;
      volumeslideTooltipText = volumeSlideTooltipErrorText;
      calculation.finevolumeSlideUnits = outputErrorText;
      finevolumeSlideTooltipText = finevolumeSlideTooltipErrorText;
    }
    commandsResult.innerHTML = calculation.commandsToggle.toString();
    commandsResult.title = volumeSlideTooltipText;
    unitsResult.innerHTML = calculation.finevolumeSlideUnits.toString(16).toUpperCase();
    unitsResult.title = finevolumeSlideTooltipText;		
  }
  // Add handler for Check checkbox state and show/hide fine volume slide
  finevolumeSlideCheckbox.addEventListener(
    "change",
    handleCheckboxState
  );

  // Handler for values calculation
  const handleCalculateValues = () => {

    // Get input element values and convert them to integers
    const getInputElementsValues = () => {
      calculation.tics = parseInt(ticsButton.value);
      calculation.tics --; // Without first tick
      calculation.instrumentVolume = parseInt(instrumentVolumeButton.value);
      calculation.units = parseInt(unitsButton.value);
    }

    // Calculate coomands per row without fine volume slide
    const calculateUnits = () => {
      calculation.volumeSlideCommands = Math.ceil(calculation.instrumentVolume / calculation.tics);
      calculation.volumeSlideCommands = Math.ceil(calculation.volumeSlideCommands / calculation.units);
    }

    // Calculate comands per row and units per command considering fine volume slide
    const calculateUnitsFinevolume = () => {
      calculation.finevolumeSlideCommands = Math.floor((calculation.instrumentVolume / calculation.tics) / calculation.units);
      calculation.finevolumeSlideUnits = (calculation.instrumentVolume % calculation.tics);
    }

    // Check maxinun of volume slide commands number or fine volume slide units number and output units
    const outputUnits = () => {
      let [volumeSlideTooltipText, finevolumeSlideTooltipText] = [definedVolumeslideTooltipText, definedFinevolumeSlideTooltipText];
      if (calculation.volumeSlideCommands <= maxVolumeSlideCommands && calculation.finevolumeSlideUnits <= maxFinevolumeSlideUnits) {
        calculation.finevolumeSlideUnits = calculation.finevolumeSlideUnits;
        setDefaultTextColor();
      }
      else {
        calculation.commandsToggle = outputErrorText;
        volumeSlideTooltipText = volumeSlideTooltipErrorText;
        calculation.finevolumeSlideUnits = outputErrorText;
        finevolumeSlideTooltipText = finevolumeSlideTooltipErrorText;
        if ((commandsResult.classList.contains("textColored")) || (unitsResult.classList.contains("textColored"))) {
          commandsResult.classList.remove("textColored");
          commandsResult.classList.add("text-danger");
          unitsResult.classList.remove("textColored");
          unitsResult.classList.add("text-danger");
        }
      }
      // Output commands per row and fine slide units per command
      commandsResult.innerHTML = calculation.commandsToggle.toString();
      commandsResult.title = volumeSlideTooltipText;
      unitsResult.innerHTML = calculation.finevolumeSlideUnits.toString(16).toUpperCase();
      unitsResult.title = finevolumeSlideTooltipText;
    }
  
    getInputElementsValues();
    calculateUnits();
    calculateUnitsFinevolume();
    checkFinevolume();
    outputUnits();
  }
  // Add handler for values calculation
  groupChange.forEach(
    element => element.addEventListener(
      "change", 
      handleCalculateValues
    )
  );
  // Start calculation
  handleCalculateValues();

  // Reset all values
  const handleResetButton = () => {
    calculation.volumeslideCommands = 0;
		calculation.finevolumeSlideCommands = 0;
    calculation.commandsToggle = 0;
		calculation.finevolumeSlideUnits = 0;
    ticsButton.value = definedTics;
    instrumentVolumeButton.value = definedInstrumentVolume;
    unitsButton.value = definedUnits;
    commandsResult.innerHTML = "0";
    commandsResult.title = definedVolumeslideTooltipText;
    unitsResult.innerHTML = "0";
    unitsResult.title = definedFinevolumeSlideTooltipText;
		finevolumeSlideCheckbox.checked = false;
		finevolumeSlideContainer.classList.add("d-none");
    setDefaultTextColor();
    handleCalculateValues();
  }
  // Add handler for click on reset button
  resetButton.addEventListener(
    "click",
    handleResetButton
  );
}

// Add handler for VolSlideStep
document.addEventListener(
  "DOMContentLoaded",
  handleVolSlideStep,
  false
);