// Basic classes to create an editor.
import Editor from '@ckeditor/ckeditor5-core/src/editor/editor';
import EditorUI from '@ckeditor/ckeditor5-core/src/editor/editorui';
import EditorUIView from '@ckeditor/ckeditor5-ui/src/editorui/editoruiview';
import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker';
import ComponentFactory from '@ckeditor/ckeditor5-ui/src/componentfactory';
import InlineEditableUIView from '@ckeditor/ckeditor5-ui/src/editableui/inline/inlineeditableuiview';
import ElementReplacer from '@ckeditor/ckeditor5-utils/src/elementreplacer';

// Interfaces to extend the basic Editor API.
import DataApiMixin from '@ckeditor/ckeditor5-core/src/editor/utils/dataapimixin';
import ElementApiMixin from '@ckeditor/ckeditor5-core/src/editor/utils/elementapimixin';

// Helper function for adding interfaces to the Editor class.
import mix from '@ckeditor/ckeditor5-utils/src/mix';

// Helper function that gets the data from an HTML element that the Editor is attached to.
import getDataFromElement from '@ckeditor/ckeditor5-utils/src/dom/getdatafromelement';

// Helper function that binds the editor with an HTMLForm element.
import attachToForm from '@ckeditor/ckeditor5-core/src/editor/utils/attachtoform';

// Basic features that every editor should enable.
import Clipboard from '@ckeditor/ckeditor5-clipboard/src/clipboard';
import Enter from '@ckeditor/ckeditor5-enter/src/enter';
import Typing from '@ckeditor/ckeditor5-typing/src/typing';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import UndoEditing from '@ckeditor/ckeditor5-undo/src/undoengine';

// Basic features associated with the edited content.
import BoldEditing from '@ckeditor/ckeditor5-basic-styles/src/bold/boldediting';
import ItalicEditing from '@ckeditor/ckeditor5-basic-styles/src/italic/italicediting';
import UnderlineEditing from '@ckeditor/ckeditor5-basic-styles/src/underline/underlineediting';
import HeadingEditing from '@ckeditor/ckeditor5-heading/src/heading/headingediting';


// Extending the Editor class, which brings the base editor API.
export default class BootstrapEditor extends Editor {
    constructor( element, config ) {
        super( config );

        // Remember the element the editor is created with.
        this.sourceElement = element;

        // Create the ("main") root element of the model tree.
        this.model.document.createRoot();

        // The UI layer of the editor.
        this.ui = new BootstrapEditorUI( this );

        // When editor#element is a textarea inside a form element,
        // the content of this textarea will be updated on form submit.
        attachToForm( this );
    }

    destroy() {
        // When destroyed, the editor sets the output of editor#getData() into editor#element...
        this.updateSourceElement();

        // ...and destroys the UI.
        this.ui.destroy();

        return super.destroy();
    }

    static create( element, config ) {
        return new Promise( resolve => {
            const editor = new this( element, config );

            resolve(
                editor.initPlugins()
                // Initialize the UI first. See the BootstrapEditorUI class to learn more.
                    .then( () => editor.ui.init( element ) )
                    // Fill the editable with the initial data.
                    .then( () => editor.data.init( getDataFromElement( element ) ) )
                    // Fire the `editor#ready` event that announce the editor is complete and ready to use.
                    .then( () => editor.fire( 'ready' ) )
                    .then( () => editor )
            );
        } );
    }
}

// Mixing interfaces, which extends the basic editor API.
mix( BootstrapEditor, DataApiMixin );
mix( BootstrapEditor, ElementApiMixin );
