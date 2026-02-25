// Audio System for ARKAD
// Maps keyboard keys to musical notes and manages audio playback

const AudioSystem = () => {
  const activeOscillators = new Map();
  const maxPolyphony = 25;

  // Standard A4 = 440Hz, 12-tone equal temperament
  // f = 440 * 2^((n-49)/12) where n is the piano key number
  const noteToFrequency = ( semitones ) => 440 * Math.pow( 2, semitones / 12 );

  // Top row: E Major scale (E F# G# A B C# D# E)
  // Middle row: C Major scale (C D E F G A B C D)
  // Bottom row: A Major scale (A B C# D E F# G#)
  const keyMapping = {
    // Top row - E Major (starting at E4)
    'q': { frequency: noteToFrequency( -5 ), row: 'top' },   // E4
    'w': { frequency: noteToFrequency( -3 ), row: 'top' },   // F#4
    'e': { frequency: noteToFrequency( -1 ), row: 'top' },   // G#4
    'r': { frequency: noteToFrequency( 0 ), row: 'top' },    // A4
    't': { frequency: noteToFrequency( 2 ), row: 'top' },    // B4
    'y': { frequency: noteToFrequency( 4 ), row: 'top' },    // C#5
    'u': { frequency: noteToFrequency( 6 ), row: 'top' },    // D#5
    'i': { frequency: noteToFrequency( 7 ), row: 'top' },    // E5
    'o': { frequency: noteToFrequency( 9 ), row: 'top' },    // F#5
    'p': { frequency: noteToFrequency( 11 ), row: 'top' },   // G#5

    // Middle row - C Major (starting at C4)
    'a': { frequency: noteToFrequency( -9 ), row: 'middle' }, // C4
    's': { frequency: noteToFrequency( -7 ), row: 'middle' }, // D4
    'd': { frequency: noteToFrequency( -5 ), row: 'middle' }, // E4
    'f': { frequency: noteToFrequency( -4 ), row: 'middle' }, // F4
    'g': { frequency: noteToFrequency( -2 ), row: 'middle' }, // G4
    'h': { frequency: noteToFrequency( 0 ), row: 'middle' },  // A4
    'j': { frequency: noteToFrequency( 2 ), row: 'middle' },  // B4
    'k': { frequency: noteToFrequency( 3 ), row: 'middle' },  // C5
    'l': { frequency: noteToFrequency( 5 ), row: 'middle' },  // D5

    // Bottom row - A Major (starting at A3)
    'z': { frequency: noteToFrequency( -12 ), row: 'bottom' }, // A3
    'x': { frequency: noteToFrequency( -10 ), row: 'bottom' }, // B3
    'c': { frequency: noteToFrequency( -8 ), row: 'bottom' },  // C#4
    'v': { frequency: noteToFrequency( -7 ), row: 'bottom' },  // D4
    'b': { frequency: noteToFrequency( -5 ), row: 'bottom' },  // E4
    'n': { frequency: noteToFrequency( -3 ), row: 'bottom' },  // F#4
    'm': { frequency: noteToFrequency( -1 ), row: 'bottom' }   // G#4
  };

  // Color palettes for each row
  const colorPalettes = {top: [
    { red: 245, green: 110, blue: 98 },  // #F56E62 coral
    { red: 255, green: 233, blue: 116 }  // #FFE974 yellow
  ],
  middle: [
    { red: 145, green: 201, blue: 240 }, // #91C9F0 blue
    { red: 100, green: 224, blue: 126 }  // #64E07E green
  ],
  bottom: [
    { red: 230, green: 138, blue: 193 }  // #E68AC1 pink
  ]};

  const isValidKey = ( keyChar ) => {
    return keyMapping.hasOwnProperty( keyChar.toLowerCase() );
  };

  const getColorForKey = ( keyChar ) => {
    const key = keyChar.toLowerCase();
    if ( !isValidKey( key ) ) {
      return null;
    }

    const row = keyMapping[key].row;
    const palette = colorPalettes[row];
    const colorIndex = Math.floor( Math.random() * palette.length );

    return palette[colorIndex];
  };

  const playNote = ( keyChar ) => {
    const key = keyChar.toLowerCase();
    if ( !isValidKey( key ) ) {
      return null;
    }

    // Enforce polyphony limit
    if ( activeOscillators.size >= maxPolyphony ) {
      const firstKey = activeOscillators.keys().next().value;
      stopNote( firstKey );
    }

    // Don't create duplicate oscillators for the same key
    if ( activeOscillators.has( key ) ) {
      return activeOscillators.get( key );
    }

    const noteData = keyMapping[key];
    const osc = new p5.Oscillator( 'sine' );

    osc.freq( noteData.frequency );
    osc.amp( 0 );
    osc.start();

    // Piano-like envelope: quick attack, then decay
    osc.amp( 0.3, 0.02 );
    osc.amp( 0, 0.3, 0.02 );

    // Auto-cleanup after note finishes
    setTimeout( () => {
      if ( activeOscillators.has( key ) ) {
        osc.stop();
        activeOscillators.delete( key );
      }
    }, 400 );

    activeOscillators.set( key, osc );

    return osc;
  };

  const stopNote = ( keyChar ) => {
    const key = keyChar.toLowerCase();
    if ( !activeOscillators.has( key ) ) {
      return;
    }

    const osc = activeOscillators.get( key );

    // Quick fade-out
    osc.amp( 0, 0.1 );

    // Clean up after fade completes
    setTimeout( () => {
      if ( activeOscillators.has( key ) ) {
        osc.stop();
        activeOscillators.delete( key );
      }
    }, 150 );
  };

  return {
    isValidKey,
    getColorForKey,
    playNote,
    stopNote
  };
};
