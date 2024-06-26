/* eslint-disable ember/no-get, ember/no-new-mixins, prettier/prettier */
import Mixin from '@ember/object/mixin';

/**
 * Wraps the native drop events to make your components droppable.
 *
 * @mixin Droppable
 */

var Droppable = Mixin.create({
  _currentDrag: null,
  classNameBindings: [
    'accepts-drag',
    'self-drop'
  ],

  /**
   * Read-only className property that is set to true when the component is
   * receiving a valid drag event. You can style your element with
   * `.accepts-drag`.
   *
   * @property accepts-drag
   * @private
   */

  'accepts-drag': false,

  /**
   * Will be true when the component is dragged over itself. Can use
   * `.self-drop` in your css to style (or more common, unstyle) the component.
   *
   * @property self-drop
   * @private
   */

  'self-drop': false,

 /**
   * Validates drag events. Override this to restrict which data types your
   * component accepts.
   *
   * Example:
   *
   * ```js
   * validateDragEvent(event) {
   *   return event.dataTransfer.types.contains('text/x-foo');
   * }
   * ```
   *
   * @method validateDragEvent
   * @public
   */

  validateDragEvent() {
    return true;
  },

  /**
   * Called when a valid drag event is dropped on the component. Override to
   * actually make something happen.
   *
   * ```js
   * acceptDrop: function(event) {
   *   var data = event.dataTransfer.getData('text/plain');
   *   doSomethingWith(data);
   * }
   * ```
   *
   * @method acceptDrop
   * @public
   */

  acceptDrop() {},

  handleDragOver() {},
  handleDragOut() {},

  /**
   * @method dragOver
   * @private
   */

  dragOver(event) {
    if (this._droppableIsDraggable(event)) {
      this.set('self-drop', true);
    }
    if (this.get('accepts-drag')) {
      return this._allowDrop(event);
    }
    if (this.validateDragEvent(event)) {
      this.set('accepts-drag', true);
      this._allowDrop(event);
    } else {
      this._resetDroppability();
    }
  },

  /**
   * @method dragEnter
   * @private
   */

  dragEnter() {
    return false;
  },

  /**
   * @method drop
   * @private
   */

  drop(event) {
    // have to validate on drop because you may have nested sortables the
    // parent allows the drop but the child receives it, revalidating allows
    // the event to bubble up to the parent to handle it
    if (!this.validateDragEvent(event)) {
      return;
    }
    this.acceptDrop(event);
    this._resetDroppability();
    // TODO: might not need this? I can't remember why its here
    event.stopPropagation();
    return false;
  },

  /**
   * Tells the browser we have an acceptable drag event.
   *
   * @method _allowDrop
   * @private
   */

  _allowDrop(event) {
    this.handleDragOver(event);
    event.stopPropagation();
    event.preventDefault();
    return false;
  },

  /**
   * We want to be able to know if the current drop target is the original
   * element being dragged or a child of it.
   *
   * @method _droppableIsDraggable
   * @private
   */

  _droppableIsDraggable(event) {
    return Droppable._currentDrag && (
      Droppable._currentDrag === event.target ||
      Droppable._currentDrag.contains(event.target)
    );
  },

  /**
   * @method _resetDroppability
   * @private
   */

  _resetDroppability(event) {
    this.handleDragOut(event);
    this.set('accepts-drag', false);
    this.set('self-drop', false);
  },

  dragLeave() {
   this._resetDroppability();
  },

  // Need to track this so we can determine `self-drop`.
  // It's on `Droppable` so we can test :\
  dragStart(event) {
    this.set('_currentDrag', event.target);
  }

});

export default Droppable;
