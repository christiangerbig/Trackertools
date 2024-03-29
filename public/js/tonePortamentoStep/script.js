const handleTonePortaStep = () => {
  const constants = {
    definedTics: "6",
    definedCommands: "1",
    definedTooltipText: "Number of units ranges from hex 01 to FF",
    semiToneOctaves: 12,
    octaves: 3,
    semiTones: 0, // Will be initialized later
    maxUnits: 255,
    errorText: "**",
    tooltipErrorText: "Calculated number of units is greater than hex FF",
    // HTML element objects
    htmlElements: {
      sourceNoteSelect: document.querySelector("#source-note-select"),
      sourceOctaveSelect: document.querySelector("#source-octave-select"),
      sourceFinetuneSelect: document.querySelector("#source-finetune-select"),
      sourceNoteContainer: document.querySelector("#source-note-container"),
      destinationNoteSelect: document.querySelector("#destination-note-select"),
      destinationOctaveSelect: document.querySelector(
        "#destination-octave-select"
      ),
      destinationFinetuneSelect: document.querySelector(
        "#destination-finetune-select"
      ),
      destinationNoteContainer: document.querySelector(
        "#destination-note-container"
      ),
      ticsInput: document.querySelector("#tics-Input"),
      commandsInput: document.querySelector("#commands-input"),
      unitsResult: document.querySelector("#units-result"),
      resetButton: document.querySelector("#reset-button"),
      groupChange: document.querySelectorAll(".group-change"),
    },
    // Key codes for note periods C  C#  D  D#  E  F  F#  G  G#  A  A#  B and three octaves
    shortkeyHTMLCodes: [
      99, 67, 100, 68, 101, 102, 70, 103, 71, 97, 65, 98, 49, 50, 51,
    ],
    // Index for note periods C  C# D  D# E  F  F# G  G# A  A#  B and three octaves
    shortkeyIndexes: [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "0",
      "1",
      "2",
    ],
    // Period values for three octaves and different tunings
    notePeriods: [
      // Tuning 0, normal
      856, 808, 762, 720, 678, 640, 604, 570, 538, 508, 480, 453, 428, 404, 381,
      360, 339, 320, 302, 285, 269, 254, 240, 226, 214, 202, 190, 180, 170, 160,
      151, 143, 135, 127, 120, 113,
      // Tuning 1
      850, 802, 757, 715, 674, 637, 601, 567, 535, 505, 477, 450, 425, 401, 379,
      357, 337, 318, 300, 284, 268, 253, 239, 225, 213, 201, 189, 179, 169, 159,
      150, 142, 134, 126, 119, 113,
      // Tuning 2
      844, 796, 752, 709, 670, 632, 597, 563, 532, 502, 474, 447, 422, 398, 376,
      355, 335, 316, 298, 282, 266, 251, 237, 224, 211, 199, 188, 177, 167, 158,
      149, 141, 133, 125, 118, 112,
      // Tuning 3
      838, 791, 746, 704, 665, 628, 592, 559, 528, 498, 470, 444, 419, 395, 373,
      352, 332, 314, 296, 280, 264, 249, 235, 222, 209, 198, 187, 176, 166, 157,
      148, 140, 132, 125, 118, 111,
      // Tuning 4
      832, 785, 741, 699, 660, 623, 588, 555, 524, 495, 467, 441, 416, 392, 370,
      350, 330, 312, 294, 278, 262, 247, 233, 220, 208, 196, 185, 175, 165, 156,
      147, 139, 131, 124, 117, 110,
      // Tuning 5
      826, 779, 736, 694, 655, 619, 584, 551, 520, 491, 463, 437, 413, 390, 368,
      347, 328, 309, 292, 276, 260, 245, 232, 219, 206, 195, 184, 174, 164, 155,
      146, 138, 130, 123, 116, 109,
      // Tuning 6
      820, 774, 730, 689, 651, 614, 580, 547, 516, 487, 460, 434, 410, 387, 365,
      345, 325, 307, 290, 274, 258, 244, 230, 217, 205, 193, 183, 172, 163, 154,
      145, 137, 129, 122, 115, 109,
      // Tuning 7
      814, 768, 725, 684, 646, 610, 575, 543, 513, 484, 457, 431, 407, 384, 363,
      342, 323, 305, 288, 272, 256, 242, 228, 216, 204, 192, 181, 171, 161, 152,
      144, 136, 128, 121, 114, 108,
      // Tuning -8
      907, 856, 808, 762, 720, 678, 640, 604, 570, 538, 508, 480, 453, 428, 404,
      381, 360, 339, 320, 302, 285, 269, 254, 240, 226, 214, 202, 190, 180, 170,
      160, 151, 143, 135, 127, 120,
      // Tuning -7
      900, 850, 802, 757, 715, 675, 636, 601, 567, 535, 505, 477, 450, 425, 401,
      379, 357, 337, 318, 300, 284, 268, 253, 238, 225, 212, 200, 189, 179, 169,
      159, 150, 142, 134, 126, 119,
      // Tuning -6
      894, 844, 796, 752, 709, 670, 632, 597, 563, 532, 502, 474, 447, 422, 398,
      376, 355, 335, 316, 298, 282, 266, 251, 237, 223, 211, 199, 188, 177, 167,
      158, 149, 141, 133, 125, 118,
      // Tuning -5
      887, 838, 791, 746, 704, 665, 628, 592, 559, 528, 498, 470, 444, 419, 395,
      373, 352, 332, 314, 296, 280, 264, 249, 235, 222, 209, 198, 187, 176, 166,
      157, 148, 140, 132, 125, 118,
      // Tuning -4
      881, 832, 785, 741, 699, 660, 623, 588, 555, 524, 494, 467, 441, 416, 392,
      370, 350, 330, 312, 294, 278, 262, 247, 233, 220, 208, 196, 185, 175, 165,
      156, 147, 139, 131, 123, 117,
      // Tuning -3
      875, 826, 779, 736, 694, 655, 619, 584, 551, 520, 491, 463, 437, 413, 390,
      368, 347, 328, 309, 292, 276, 260, 245, 232, 219, 206, 195, 184, 174, 164,
      155, 146, 138, 130, 123, 116,
      // Tuning -2
      868, 820, 774, 730, 689, 651, 614, 580, 547, 516, 487, 460, 434, 410, 387,
      365, 345, 325, 307, 290, 274, 258, 244, 230, 217, 205, 193, 183, 172, 163,
      154, 145, 137, 129, 122, 115,
      // Tuning -1
      862, 814, 768, 725, 684, 646, 610, 575, 543, 513, 484, 457, 431, 407, 384,
      363, 342, 323, 305, 288, 272, 256, 242, 228, 216, 203, 192, 181, 171, 161,
      152, 144, 136, 128, 121, 114,
    ],
  };

  const {
    semiToneOctaves,
    octaves,
    definedTics,
    definedCommands,
    definedTooltipText,
  } = constants;
  constants.semiTones = semiToneOctaves * octaves;

  class NoteObject {
    constructor(
      periodIndex,
      octaveIndex,
      finetuneIndex,
      notePeriodsIndex,
      period
    ) {
      this.periodIndex = periodIndex;
      this.octaveIndex = octaveIndex;
      this.finetuneIndex = finetuneIndex;
      this.notePeriodsIndex = notePeriodsIndex;
      this.period = period;
    }
  }

  const sourceNote = new NoteObject(0, 0, 0, 0, 0);
  const destinationNote = new NoteObject(0, 0, 0, 0, 0);

  const variables = {
    tics: definedTics,
    commands: definedCommands,
    periodDiff: 0,
    ticsPeriodDiff: 0,
    commandsPeriodDiff: 0,
    commandUnits: 0,
    tooltipText: definedTooltipText,
    handleSwitchDestinationFinetuneCallback: null,
    handleSwitchSourceFinetuneCallback: null,
    handleGetSourceNoteCallback: null,
    handleSetSourceNoteCallback: null,
    handleMouseLeaveSourceNoteCallback: null,
    handleGetDestinationNoteCallback: null,
    handleSetDestinationNoteCallback: null,
    handleMouseLeaveDestinationNoteCallback: null,
    handleCalculatePortamentoCallback: null,
  };

  const setDefaultTextColor = ({ htmlElements: { unitsResult } }) => {
    if (unitsResult.classList.contains("text-danger")) {
      unitsResult.classList.remove("text-danger");
      unitsResult.classList.add("is-dark-grey");
    }
  };

  const handleSwitchDestinationFinetune = ({
    htmlElements: { sourceFinetuneSelect, destinationFinetuneSelect },
  }) => {
    destinationFinetuneSelect.value = sourceFinetuneSelect.value;
  };

  const addSwitchDestinationFinetuneHandler = (
    handleSwitchDestinationFinetune,
    { constants, variables }
  ) => {
    variables.handleSwitchDestinationFinetuneCallback = () => {
      handleSwitchDestinationFinetune(constants);
    };

    const {
      htmlElements: { sourceFinetuneSelect },
    } = constants;
    sourceFinetuneSelect.addEventListener(
      "click",
      variables.handleSwitchDestinationFinetuneCallback
    );
  };

  addSwitchDestinationFinetuneHandler(handleSwitchDestinationFinetune, {
    constants,
    variables,
  });

  const handleSwitchSourceFinetune = ({
    htmlElements: { sourceFinetuneSelect, destinationFinetuneSelect },
  }) => {
    sourceFinetuneSelect.value = destinationFinetuneSelect.value;
  };

  const addSwitchSourceFinetuneHandler = (
    handleSwitchSourceFinetune,
    { constants, variables }
  ) => {
    variables.handleSwitchSourceFinetuneCallback = () => {
      handleSwitchSourceFinetune(constants);
    };

    const {
      htmlElements: { destinationFinetuneSelect },
    } = constants;
    destinationFinetuneSelect.addEventListener(
      "click",
      variables.handleSwitchSourceFinetuneCallback
    );
  };
  addSwitchSourceFinetuneHandler(handleSwitchSourceFinetune, {
    constants,
    variables,
  });

  const handleSetSourceNote = (
    { sourceNote, destinationNote },
    { constants, variables }
  ) => {
    const handleGetSourceNote = (
      { which, keyCode },
      { sourceNote, destinationNote },
      { constants, variables }
    ) => {
      const chararacter = which || keyCode;
      const {
        shortkeyHTMLCodes,
        shortkeyIndexes,
        htmlElements: { sourceNoteSelect, sourceOctaveSelect },
      } = constants;
      for (let i = 0; i < shortkeyHTMLCodes.length; i++) {
        if (shortkeyHTMLCodes[i] === chararacter) {
          if (chararacter >= 65) {
            sourceNoteSelect.value = shortkeyIndexes[i];
            break;
          } else {
            sourceOctaveSelect.value = shortkeyIndexes[i];
            break;
          }
        }
      }
      handleCalculatePortamento(
        { sourceNote, destinationNote },
        { constants, variables }
      );
    };

    const addGetSourceNoteHandler = (
      handleGetSourceNote,
      { constants, variables }
    ) => {
      variables.handleGetSourceNoteCallback = (event) =>
        handleGetSourceNote(
          event,
          { sourceNote, destinationNote },
          { constants, variables }
        );

      const {
        htmlElements: { sourceNoteContainer },
      } = constants;
      sourceNoteContainer.addEventListener(
        "keypress",
        variables.handleGetSourceNoteCallback
      );
    };

    const {
      htmlElements: { sourceNoteContainer },
    } = constants;
    sourceNoteContainer.focus();
    addGetSourceNoteHandler(handleGetSourceNote, { constants, variables });
  };

  const addSetSourceNoteHandler = (
    handleSetSourceNote,
    { constants, variables }
  ) => {
    variables.handleSetSourceNoteCallback = () => {
      handleSetSourceNote(
        { sourceNote, destinationNote },
        { constants, variables }
      );
    };

    const {
      htmlElements: { sourceNoteContainer },
    } = constants;
    sourceNoteContainer.addEventListener(
      "mouseenter",
      variables.handleSetSourceNoteCallback
    );
  };

  addSetSourceNoteHandler(handleSetSourceNote, { constants, variables });

  const handleMouseLeaveSourceNote = ({ constants, variables }) => {
    const {
      htmlElements: { sourceNoteContainer },
    } = constants;
    sourceNoteContainer.blur();
    sourceNoteContainer.removeEventListener(
      "keypress",
      variables.handleGetSourceNoteCallback
    );
  };

  const addMouseLeaveSourceNoteHandler = (
    handleMouseLeaveSourceNote,
    { constants, variables }
  ) => {
    variables.handleMouseLeaveSourceNoteCallback = () => {
      handleMouseLeaveSourceNote({ constants, variables });
    };

    const {
      htmlElements: { sourceNoteContainer },
    } = constants;
    sourceNoteContainer.addEventListener(
      "mouseleave",
      variables.handleMouseLeaveSourceNoteCallback
    );
  };

  addMouseLeaveSourceNoteHandler(handleMouseLeaveSourceNote, {
    constants,
    variables,
  });

  const handleSetDestinationNote = (
    { sourceNote, destinationNote },
    { constants, variables }
  ) => {
    const handleGetDestinationNote = (
      { which, keyCode },
      { sourceNote, destinationNote },
      { constants, variables }
    ) => {
      const character = which || keyCode;
      const {
        shortkeyHTMLCodes,
        shortkeyIndexes,
        htmlElements: { destinationNoteSelect, destinationOctaveSelect },
      } = constants;
      for (let i = 0; i < shortkeyHTMLCodes.length; i++) {
        if (shortkeyHTMLCodes[i] === character) {
          if (character >= 65) {
            destinationNoteSelect.value = shortkeyIndexes[i];
            break;
          } else {
            destinationOctaveSelect.value = shortkeyIndexes[i];
            break;
          }
        }
      }
      handleCalculatePortamento(
        { sourceNote, destinationNote },
        { constants, variables }
      );
    };

    const addGetDestinationNoteHandler = (
      handleGetDestinationNote,
      { constants, variables }
    ) => {
      variables.handleGetDestinationNoteCallback = (event) => {
        handleGetDestinationNote(
          event,
          { sourceNote, destinationNote },
          { constants, variables }
        );
      };

      const {
        htmlElements: { destinationNoteContainer },
      } = constants;
      destinationNoteContainer.addEventListener(
        "keypress",
        variables.handleGetDestinationNoteCallback
      );
    };

    const {
      htmlElements: { destinationNoteContainer },
    } = constants;
    destinationNoteContainer.focus();
    addGetDestinationNoteHandler(handleGetDestinationNote, {
      constants,
      variables,
    });
  };

  const addSetDestinationNoteHandler = (
    handleSetDestinationNote,
    { constants, variables }
  ) => {
    variables.handleSetDestinationNoteCallback = () => {
      handleSetDestinationNote(
        { sourceNote, destinationNote },
        { constants, variables }
      );
    };

    const {
      htmlElements: { destinationNoteContainer },
    } = constants;
    destinationNoteContainer.addEventListener(
      "mouseenter",
      variables.handleSetDestinationNoteCallback
    );
  };

  addSetDestinationNoteHandler(handleSetDestinationNote, {
    constants,
    variables,
  });

  const handleMouseLeaveDestinationNote = ({ constants, variables }) => {
    const {
      htmlElements: { destinationNoteContainer },
    } = constants;
    destinationNoteContainer.blur();
    destinationNoteContainer.removeEventListener(
      "keypress",
      variables.handleGetDestinationNote
    );
  };

  const addMouseLeaveDestinationNoteHandler = (
    handleMouseLeaveDestinationNote,
    { constants, variables }
  ) => {
    variables.handleMouseLeaveDestinationNoteCallback = () => {
      handleMouseLeaveDestinationNote({ constants, variables });
    };

    const {
      htmlElements: { destinationNoteContainer },
    } = constants;
    destinationNoteContainer.addEventListener(
      "mouseleave",
      variables.handleMouseLeaveDestinationNoteCallback
    );
  };

  addMouseLeaveDestinationNoteHandler(handleMouseLeaveDestinationNote, {
    constants,
    variables,
  });

  const handleCalculatePortamento = (
    { sourceNote, destinationNote },
    { constants, variables }
  ) => {
    const convertInputElementsValues = (
      { sourceNote, destinationNote },
      { constants, variables }
    ) => {
      const {
        htmlElements: {
          sourceNoteSelect,
          sourceOctaveSelect,
          sourceFinetuneSelect,
          destinationNoteSelect,
          destinationOctaveSelect,
          destinationFinetuneSelect,
          ticsInput,
          commandsInput,
        },
      } = constants;
      sourceNote.periodIndex = parseInt(sourceNoteSelect.value);
      sourceNote.octaveIndex = parseInt(sourceOctaveSelect.value);
      sourceNote.finetuneIndex = parseInt(sourceFinetuneSelect.value);
      destinationNote.periodIndex = parseInt(destinationNoteSelect.value);
      destinationNote.octaveIndex = parseInt(destinationOctaveSelect.value);
      destinationNote.finetuneIndex = parseInt(destinationFinetuneSelect.value);
      variables.tics = parseInt(ticsInput.value);
      variables.tics--; // Without first tick
      variables.commands = parseInt(commandsInput.value);
    };

    const fetchNotePeriods = (
      { semiTones, semiToneOctaves, notePeriods },
      { sourceNote, destinationNote }
    ) => {
      const fetchSourceNotePeriod = (
        { semiTones, semiToneOctaves, notePeriods },
        sourceNote
      ) => {
        const { periodIndex, octaveIndex, finetuneIndex } = sourceNote;
        sourceNote.notePeriodsIndex =
          periodIndex +
          octaveIndex * semiToneOctaves +
          finetuneIndex * semiTones;
        sourceNote.period = notePeriods[sourceNote.notePeriodsIndex];
      };

      const fetchDestinationNotePeriod = (
        { semiTones, semiToneOctaves, notePeriods },
        destinationNote
      ) => {
        const { periodIndex, octaveIndex, finetuneIndex } = destinationNote;
        destinationNote.notePeriodsIndex =
          periodIndex +
          octaveIndex * semiToneOctaves +
          finetuneIndex * semiTones;
        destinationNote.period = notePeriods[destinationNote.notePeriodsIndex];
      };

      fetchSourceNotePeriod(
        { semiTones, semiToneOctaves, notePeriods },
        sourceNote
      );
      fetchDestinationNotePeriod(
        { semiTones, semiToneOctaves, notePeriods },
        destinationNote
      );
    };

    const calculateUnitsPerCommand = (
      { sourceNote, destinationNote },
      variables
    ) => {
      const { tics, commands } = variables;
      variables.periodDiff = Math.abs(
        destinationNote.period - sourceNote.period
      );
      variables.ticsPeriodDiff = Math.ceil(variables.periodDiff / tics);
      variables.commandsPeriodDiff = Math.ceil(
        variables.ticsPeriodDiff / commands
      );
    };

    const printUnitsPerCommand = ({ constants, variables }) => {
      const {
        definedTooltipText,
        errorText,
        tooltipErrorText,
        maxUnits,
        htmlElements: { unitsResult },
      } = constants;
      variables.tooltipText = definedTooltipText;
      const { commandsPeriodDiff } = variables;
      if (commandsPeriodDiff <= maxUnits) {
        variables.commandUnits = commandsPeriodDiff
          .toString(16)
          .padStart(2, 0, 0)
          .toUpperCase();
        setDefaultTextColor(constants);
      } else {
        variables.commandUnits = errorText;
        variables.tooltipText = tooltipErrorText;
        if (unitsResult.classList.contains("is-dark-grey")) {
          unitsResult.classList.remove("is-dark-grey");
          unitsResult.classList.add("text-danger");
        }
      }
      unitsResult.innerHTML = variables.commandUnits;
      unitsResult.title = variables.tooltipText;
    };

    convertInputElementsValues(
      { sourceNote, destinationNote },
      { constants, variables }
    );
    fetchNotePeriods(constants, { sourceNote, destinationNote });
    calculateUnitsPerCommand({ sourceNote, destinationNote }, variables);
    printUnitsPerCommand({ constants, variables });
  };

  const addCalculatePortamentoHandler = (
    handleCalculatePortamento,
    { constants, variables }
  ) => {
    const {
      htmlElements: { groupChange },
    } = constants;
    groupChange.forEach((element) => {
      variables.handleCalculatePortamentoCallback = () => {
        handleCalculatePortamento(
          { sourceNote, destinationNote },
          { constants, variables }
        );
      };

      element.addEventListener(
        "change",
        variables.handleCalculatePortamentoCallback
      );
    });
  };

  addCalculatePortamentoHandler(handleCalculatePortamento, {
    constants,
    variables,
  });

  const handleResetButton = (constants) => {
    const {
      definedTics,
      definedCommands,
      definedTooltipText,
      htmlElements: {
        sourceNoteSelect,
        sourceOctaveSelect,
        sourceFinetuneSelect,
        destinationNoteSelect,
        destinationOctaveSelect,
        destinationFinetuneSelect,
        ticsInput,
        commandsInput,
        unitsResult,
      },
    } = constants;
    sourceNoteSelect.value = "0";
    sourceOctaveSelect.value = "0";
    sourceFinetuneSelect.value = "0";
    destinationNoteSelect.value = "0";
    destinationOctaveSelect.value = "0";
    destinationFinetuneSelect.value = "0";
    ticsInput.value = definedTics;
    commandsInput.value = definedCommands;
    unitsResult.innerHTML = "00";
    unitsResult.title = definedTooltipText;
    setDefaultTextColor(constants);
  };

  const addResetButtonHandler = (handleResetButton, constants) => {
    const handleResetButtonCallback = () => {
      handleResetButton(constants);
    };

    const {
      htmlElements: { resetButton },
    } = constants;
    resetButton.addEventListener("click", handleResetButtonCallback);
  };

  addResetButtonHandler(handleResetButton, constants);
};

const addTonePortaStepHandler = (handleTonePortaStep) => {
  document.addEventListener("DOMContentLoaded", handleTonePortaStep, false);
};

addTonePortaStepHandler(handleTonePortaStep);
