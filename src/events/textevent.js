/*globals doodle*/

/* DOM 3 Event: TextEvent:UIEvent
 * http://www.w3.org/TR/DOM-Level-3-Events/#events-textevents
 */
(function () {
  var textevent_static_properties,
      isTextEvent,
      /*DEBUG*/
      check_textevent_type,
      check_boolean_type = doodle.utils.types.check_boolean_type,
      check_number_type = doodle.utils.types.check_number_type,
      check_string_type = doodle.utils.types.check_string_type,
      /*END_DEBUG*/
      isEvent = doodle.Event.isEvent;
  
  /* Super constructor
   * @param {String} type
   * @param {Boolean} bubbles
   * @param {Boolean} cancelable
   * @param {DOM Object} view
   * @param {String} data
   * @param {Number} inputMode
   *
   * @alternative instantiation
   * @param {Event} initializer event to wrap
   *
   * @return {TextEvent}
   */
  doodle.TextEvent = function (type, bubbles, cancelable, view, data, inputMode) {
    var textevent,
        arg_len = arguments.length,
        init_obj, //function, event
        copy_textevent_properties; //fn declared per event for private vars

    /*DEBUG*/
    if (arg_len === 0 || arg_len > 6) {
      throw new SyntaxError("[object TextEvent](type, bubbles, cancelable, view, data, inputMode): Invalid number of parameters.");
    }
    /*END_DEBUG*/

    //initialize uievent prototype with another event, function, or args
    if (isEvent(arguments[0])) {
      /*DEBUG*/
      if (arg_len > 1) {
        throw new SyntaxError("[object TextEvent](event): Invalid number of parameters.");
      }
      /*END_DEBUG*/
      init_obj = arguments[0];
      type = undefined;
      textevent = Object.create(doodle.UIEvent(init_obj));
    } else if (typeof arguments[0] === 'function') {
      /*DEBUG*/
      if (arg_len > 1) {
        throw new SyntaxError("[object TextEvent](function): Invalid number of parameters.");
      }
      /*END_DEBUG*/
      init_obj = arguments[0];
      type = undefined;
      //use empty event type for now, will check after we call the init function.
      textevent = Object.create(doodle.UIEvent(''));
    } else {
      //parameter defaults
      bubbles = (bubbles === undefined) ? false : bubbles;
      cancelable = (cancelable === undefined) ? false : cancelable;
      view = (view === undefined) ? null : view;
      /*DEBUG*/
      check_string_type(type, '[object TextEvent]', '*type*, bubbles, cancelable, view, data, inputMode');
      check_boolean_type(bubbles, '[object TextEvent]', 'type, *bubbles*, cancelable, view, data, inputMode');
      check_boolean_type(cancelable, '[object TextEvent]', 'type, bubbles, *cancelable*, view, data, inputMode');
      /*END_DEBUG*/
      textevent = Object.create(doodle.UIEvent(type, bubbles, cancelable, view));
    }
    
    Object.defineProperties(textevent, textevent_static_properties);
    //properties that require privacy
    Object.defineProperties(textevent, (function () {
      var evt_data = '',
          evt_inputMode = doodle.TextEvent.INPUT_METHOD_UNKNOWN;

      
      /* @param {TextEvent} evt TextEvent to copy properties from.
       */
      copy_textevent_properties = function (evt) {
        /*DEBUG*/
        check_textevent_type(evt, 'copy_textevent_properties', '*event*');
        /*END_DEBUG*/
        if (evt.data !== undefined) { evt_data = evt.data; }
        if (evt.inputMode !== undefined) { evt_inputMode = evt.inputMode; }
      };
      
      return {
        'data': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_data; }
        },

        'inputMode': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_inputMode; }
        },

        'initTextEvent': {
          value: function (typeArg, canBubbleArg, cancelableArg, viewArg, dataArg, inputModeArg) {
            //parameter defaults
            canBubbleArg = (canBubbleArg === undefined) ? false : canBubbleArg;
            cancelableArg = (cancelableArg === undefined) ? false : cancelableArg;
            viewArg = (viewArg === undefined) ? null : viewArg;
            dataArg = (dataArg === undefined) ? '' : dataArg;
            inputModeArg = (inputModeArg === undefined) ? doodle.TextEvent.INPUT_METHOD_UNKNOWN : inputModeArg;
            /*DEBUG*/
            check_string_type(typeArg, this+'.initTextEvent', '*type*, bubbles, cancelable, view, data, inputMode');
            check_boolean_type(canBubbleArg, this+'.initTextEvent', 'type, *bubbles*, cancelable, view, data, inputMode');
            check_boolean_type(cancelableArg, this+'.initTextEvent', 'type, bubbles, *cancelable*, view, data, inputMode');
            check_string_type(dataArg, this+'.initTextEvent', 'type, bubbles, cancelable, view, *data*, inputMode');
            check_number_type(inputModeArg, this+'.initTextEvent', 'type, bubbles, cancelable, view, data, *inputMode*');
            /*END_DEBUG*/
            evt_data = dataArg;
            evt_inputMode = inputModeArg;
            
            this.initUIEvent(typeArg, canBubbleArg, cancelableArg, viewArg);
            return this;
          }
        },

        /* Copy the properties from another TextEvent.
         * Allows for the reuse of this object for further dispatch.
         * @internal
         * @param {TextEvent} evt
         */
        '__copyTextEventProperties': {
          enumerable: false,
          configurable: false,
          value: function (evt, resetTarget, resetType) {
            resetTarget = (resetTarget === undefined) ? false : resetTarget;
            resetType = (resetType === undefined) ? false : resetType;
            /*DEBUG*/
            check_textevent_type(evt, this+'.__copyTextEventProperties', '*event*, target, type');
            if (resetTarget !== false && resetTarget !== null) {
              check_node_type(evt, this+'.__copyTextEventProperties', 'event, *target*, type');
            }
            if (resetType !== false) {
              check_string_type(resetType, this+'.__copyTextEventProperties', 'event, target, *type*');
            }
            /*END_DEBUG*/
            copy_textevent_properties(evt);
            return this.__copyUIEventProperties(evt, resetTarget, resetType);
          }
        }
      };
    }()));

    //initialize textevent
    if (init_obj) {
      if (typeof init_obj === 'function') {
        init_obj.call(textevent);
        /*DEBUG*/
        //make sure we've checked our dummy type string
        if (textevent.type === undefined || textevent.type === '' ||
            textevent.bubbles === undefined ||
            textevent.cancelable === undefined) {
          throw new SyntaxError("[object TextEvent](function): Must call 'this.initTextEvent(type, bubbles, cancelable, view, data, inputMode)' within the function argument.");
        }
        /*END_DEBUG*/
      } else {
        //passed a doodle or dom event object
        copy_textevent_properties(init_obj);
      }
    } else {
      //standard instantiation
      textevent.initTextEvent(type, bubbles, cancelable, view, data, inputMode);
    }
    
    return textevent;
  };
  
  
  textevent_static_properties = {
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () {
        return "[object TextEvent]";
      }
    }
  };

  /*
   * CLASS METHODS
   */

  isTextEvent = doodle.TextEvent.isTextEvent = function (event) {
    if (!event || typeof event !== 'object' || typeof event.toString !== 'function') {
      return false;
    } else {
      event = event.toString();
    }
    return (event === '[object TextEvent]');
  };

  /*DEBUG*/
  check_textevent_type = doodle.utils.types.check_textevent_type = function (event, caller, param) {
    if (isTextEvent(event)) {
      return true;
    } else {
      caller = (caller === undefined) ? "check_textevent_type" : caller;
      param = (param === undefined) ? "" : '('+param+')';
      throw new TypeError(caller + param +": Parameter must be an TextEvent.");
    }
  };
  /*END_DEBUG*/
  
}());//end class closure
