<template>
    <div class="main">

        <!-- Top bar -->
        <vue-file-toolbar-menu :content="menu" class="bar" />

        <!-- Document editor -->
        <vue-document-editor class="editor" ref="editor" v-model:content="content" :overlay="overlay" :zoom="zoom"
            :page_format_mm="page_format_mm" :page_margins="page_margins" :display="display" />

    </div>
</template>

<script>
import VueFileToolbarMenu from 'vue-file-toolbar-menu';
import VueDocumentEditor from 'vue-document-editor'
import InvoiceTemplate from './InvoiceTemplate.ce.vue';
import { markRaw } from 'vue';

export default {
    components: { VueDocumentEditor, VueFileToolbarMenu },

    data() {
        return {
            // This is where the pages content is stored and synced
            content: [
            '<img src="https://www.utpl.edu.ec/sites/default/files/archivos/marca%20UTPL%202018-03.png" height="70" /><h4 style="text-align: center;">Documento de aceptaci&oacute;n del estudiante</h4><br /><br /><p>Loja, 28 de Julio 2023<br />&nbsp;</p><p>FERNANDA MARICELA SOTO GUERRERO</p><p><strong>DIRECTOR DE COMPUTACION<br /><br /></strong></p><p>JANE SMITH JARAMILLO MARTINEZ portador de la c&eacute;dula de identidad <strong>1105637076</strong>, estudiante de COMPUTACION de la Universidad T&eacute;cnica Particular de Loja, ACEPTO, realizar mis horas de pr&aacute;cticas preprofesionales en NODO CIA. LTDA. durante el periodo acad&eacute;mico ABR/2023 - AGO/2023 , y cumplir las siguientes responsabilidades:<br /><br /></p><ol style="list-style-type: lower-alpha;"><li style="padding-left: 30px;">Realizar las actividades acad&eacute;micas y formativas en la organizaci&oacute;n receptora.</li><li style="padding-left: 30px;">Cumplir con los horarios establecidos y el n&uacute;mero de horas para las pr&aacute;cticas preprofesionales, as&iacute; como con las actividades asignadas.<br /><br /></li><li style="padding-left: 30px;">Mantener reserva y confidencialidad de la informaci&oacute;n que reciba, conozca o maneje dentro de la instituci&oacute;n/empresa/dependencia a la que ha sido asignado.<br /><br /></li><li style="padding-left: 30px;">Cuidar los equipos e instrumentos que le sean entregados en los tiempos y plazos que permanezcan bajo su responsabilidad.<br /><br /></li><li style="padding-left: 30px;">Actuar respetando las disposiciones del Reglamento de &Eacute;tica y R&eacute;gimen Disciplinario y dem&aacute;s normativa de la UTPL, as&iacute; como las normativas y disposiciones de la organizaci&oacute;n receptora durante el periodo de las pr&aacute;cticas preprofesionales.<br /><br /></li><li style="padding-left: 30px;">Presentar a la Universidad el &ldquo;Informe Final de pr&aacute;cticas preprofesionales&rdquo; sobre las actividades realizadas, dentro de los plazos establecidos por la UTPL.<br /><br /></li><li style="padding-left: 30px;">Presentar documentos que respalden el cumplimiento de la pr&aacute;ctica.<br /><br /></li><li style="padding-left: 30px;">Dar a conocer al tutor acad&eacute;mico las incidencias que puedan afectar al normal desarrollo de las pr&aacute;cticas.</li></ol><p>&nbsp;</p><p>&nbsp;<br /><br /></p><p><strong>Firma del estudiante</strong></p><p>JANE SMITH JARAMILLO MARTINEZ</p><h3 style="text-align: center;">&nbsp;</h3>'
            ],
            zoom: 0.8,
            zoom_min: 0.10,
            zoom_max: 5.0,
            page_format_mm: [210, 297],
            page_margins: "10mm 15mm",
            display: "grid", // ["grid", "vertical", "horizontal"]
            mounted: false, // will be true after this component is mounted
            undo_count: -1, // contains the number of times user can undo (= current position in content_history)
            content_history: [] // contains the content states for undo/redo operations
        }
    },

    created() {
        // Initialize gesture flags
        let start_zoom_gesture = false;
        let start_dist_touch = false;
        let start_zoom_touch = false;

        // Manage ctrl+scroll zoom (or trackpad pinch)
        window.addEventListener("wheel", (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                this.zoom = Math.min(Math.max(this.zoom - e.deltaY * 0.01, this.zoom_min), this.zoom_max);
            }
        }, { passive: false });

        // Manage trackpad pinch on Safari
        window.addEventListener("gesturestart", (e) => {
            e.preventDefault();
            start_zoom_gesture = this.zoom;
        });
        window.addEventListener("gesturechange", (e) => {
            e.preventDefault();
            if (!start_zoom_touch) {
                this.zoom = Math.min(Math.max(start_zoom_gesture * e.scale, this.zoom_min), this.zoom_max);
            }
        });
        window.addEventListener("gestureend", () => {
            start_zoom_gesture = false;
        });

        // Manage pinch to zoom for touch devices
        window.addEventListener("touchstart", (e) => {
            if (e.touches.length == 2) {
                e.preventDefault();
                start_dist_touch = Math.hypot(
                    e.touches[0].pageX - e.touches[1].pageX,
                    e.touches[0].pageY - e.touches[1].pageY
                );
                start_zoom_touch = this.zoom;
            }
        }, { passive: false });
        window.addEventListener("touchmove", (e) => {
            if (start_dist_touch && start_zoom_touch) {
                e.preventDefault();
                let zoom = start_zoom_touch * Math.hypot(
                    e.touches[0].pageX - e.touches[1].pageX,
                    e.touches[0].pageY - e.touches[1].pageY
                ) / start_dist_touch;
                this.zoom = Math.min(Math.max(zoom, this.zoom_min), this.zoom_max);
            }
        }, { passive: false });
        window.addEventListener("touchend", () => {
            start_dist_touch = false;
            start_zoom_touch = false;
        }, { passive: false });

        // Manage history undo/redo events
        const manage_undo_redo = (e) => {
            switch (e && e.inputType) {
                case "historyUndo": e.preventDefault(); e.stopPropagation(); this.undo(); break;
                case "historyRedo": e.preventDefault(); e.stopPropagation(); this.redo(); break;
            }
        }
        window.addEventListener("beforeinput", manage_undo_redo);
        window.addEventListener("input", manage_undo_redo); // in case of beforeinput event is not implemented (Firefox)

        // If your component is susceptible to be destroyed, don't forget to
        // use window.removeEventListener in the Vue.js beforeUnmount handler
    },

    mounted() { this.mounted = true; },

    computed: {

        // This is the menu content
        menu() {
            return [
                // Main commands
                { text: "New", title: "New", icon: "description", click: () => { if (confirm("This will create an empty document. Are you sure?")) { this.content = [""]; this.resetContentHistory(); } } },
                { text: "Print", title: "Print", icon: "print", click: () => window.print() },

                { is: "spacer" },

                // Undo / redo commands
                { title: "Undo", icon: "undo", disabled: !this.can_undo, hotkey: this.isMacLike ? "command+z" : "ctrl+z", click: () => this.undo() },
                { title: "Redo", icon: "redo", disabled: !this.can_redo, hotkey: this.isMacLike ? "shift+command+z" : "ctrl+y", click: () => this.redo() },

                { is: "spacer" },

                // Rich text menus
                { icon: "format_align_left", title: "Align left", active: this.isLeftAligned, disabled: !this.current_text_style, hotkey: this.isMacLike ? "shift+command+l" : "ctrl+shift+l", click: () => document.execCommand("justifyLeft") },
                { icon: "format_align_center", title: "Align center", active: this.isCentered, disabled: !this.current_text_style, hotkey: this.isMacLike ? "shift+command+e" : "ctrl+shift+e", click: () => document.execCommand("justifyCenter") },
                { icon: "format_align_right", title: "Align right", active: this.isRightAligned, disabled: !this.current_text_style, hotkey: this.isMacLike ? "shift+command+r" : "ctrl+shift+r", click: () => document.execCommand("justifyRight") },
                { icon: "format_align_justify", title: "Justify content", active: this.isJustified, disabled: !this.current_text_style, hotkey: this.isMacLike ? "shift+command+j" : "ctrl+shift+j", click: () => document.execCommand("justifyFull") },
                { is: "separator" },
                { icon: "format_bold", title: "Bold", active: this.isBold, disabled: !this.current_text_style, hotkey: this.isMacLike ? "command+b" : "ctrl+b", click: () => document.execCommand("bold") },
                { icon: "format_italic", title: "Italic", active: this.isItalic, disabled: !this.current_text_style, hotkey: this.isMacLike ? "command+i" : "ctrl+i", click: () => document.execCommand("italic") },
                { icon: "format_underline", title: "Underline", active: this.isUnderline, disabled: !this.current_text_style, hotkey: this.isMacLike ? "command+u" : "ctrl+u", click: () => document.execCommand("underline") },
                { icon: "format_strikethrough", title: "Strike through", active: this.isStrikeThrough, disabled: !this.current_text_style, click: () => document.execCommand("strikethrough") },
                { is: "button-color", type: "compact", menu_class: "align-center", disabled: !this.current_text_style, color: this.curColor, update_color: (new_color) => document.execCommand('foreColor', false, new_color.hex8) },
                { is: "separator" },
                { icon: "format_list_numbered", title: "Numbered list", active: this.isNumberedList, disabled: !this.current_text_style, click: () => document.execCommand("insertOrderedList") },
                { icon: "format_list_bulleted", title: "Bulleted list", active: this.isBulletedList, disabled: !this.current_text_style, click: () => document.execCommand("insertUnorderedList") },
                { html: "<b>H1</b>", title: "Header 1", active: this.isH1, disabled: !this.current_text_style, click: () => document.execCommand('formatBlock', false, '<h1>') },
                { html: "<b>H2</b>", title: "Header 2", active: this.isH2, disabled: !this.current_text_style, click: () => document.execCommand('formatBlock', false, '<h2>') },
                { html: "<b>H3</b>", title: "Header 3", active: this.isH3, disabled: !this.current_text_style, click: () => document.execCommand('formatBlock', false, '<h3>') },
                { icon: "format_clear", title: "Clear format", disabled: !this.current_text_style, click() { document.execCommand('removeFormat'); document.execCommand('formatBlock', false, '<div>'); } },
                { icon: "splitscreen", title: "Page break", disabled: !this.current_text_style, click: () => this.insertPageBreak() },

                { is: "spacer" },

                { // Format menu
                    text: this.current_format_name,
                    title: "Format",
                    icon: "crop_free",
                    chevron: true,
                    menu: this.formats.map(([text, w, h]) => {
                        return {
                            text,
                            active: (this.page_format_mm[0] == w && this.page_format_mm[1] == h),
                            click: () => { this.page_format_mm = [w, h]; }
                        }
                    }),
                    menu_width: 80,
                    menu_height: 280
                },
                { // Margins menu
                    text: this.current_margins_name,
                    title: "Margins",
                    icon: "select_all",
                    chevron: true,
                    menu: this.margins.map(([text, value]) => {
                        return {
                            text: text + " (" + value + ")",
                            active: (this.page_margins == value),
                            click: () => { this.page_margins = value; }
                        }
                    }),
                    menu_width: 200,
                    menu_class: "align-center"
                },
                { // Zoom menu
                    text: Math.floor(this.zoom * 100) + "%",
                    title: "Zoom",
                    icon: "zoom_in",
                    chevron: true,
                    menu: [
                        ["200%", 2.0],
                        ["150%", 1.5],
                        ["125%", 1.25],
                        ["100%", 1.0],
                        ["75%", 0.75],
                        ["50%", 0.5],
                        ["25%", 0.25]
                    ].map(([text, zoom]) => {
                        return {
                            text,
                            active: this.zoom == zoom,
                            click: () => { this.zoom = zoom; }
                        }
                    }),
                    menu_width: 80,
                    menu_height: 280,
                    menu_class: "align-center"
                },
                { // Display mode menu
                    title: "Display",
                    icon: this.display == "horizontal" ? "view_column" : (this.display == "vertical" ? "view_stream" : "view_module"),
                    chevron: true,
                    menu: [{
                        icon: "view_module",
                        active: this.display == "grid",
                        click: () => { this.display = "grid"; }
                    }, {
                        icon: "view_column",
                        active: this.display == "horizontal",
                        click: () => { this.display = "horizontal"; }
                    }, {
                        icon: "view_stream",
                        active: this.display == "vertical",
                        click: () => { this.display = "vertical"; }
                    }],
                    menu_width: 55,
                    menu_class: "align-right"
                }
            ]
        },

        // Formats management
        current_format_name() {
            const format = this.formats.find(([, width_mm, height_mm]) => (this.page_format_mm[0] == width_mm && this.page_format_mm[1] == height_mm));
            return format ? format[0] : (this.page_format_mm[0] + "mm x " + this.page_format_mm[1] + "mm");
        },
        formats: () => [
            ["A0", 841, 1189],
            ["A0L", 1189, 841],
            ["A1", 594, 841],
            ["A1L", 841, 594],
            ["A2", 420, 594],
            ["A2L", 594, 420],
            ["A3", 297, 420],
            ["A3L", 420, 297],
            ["A4", 210, 297],
            ["A4L", 297, 210],
            ["A5", 148, 210],
            ["A5L", 210, 148],
            ["A6", 105, 148],
            ["A6L", 148, 105]
        ],

        // Margins management
        current_margins_name() {
            const margins = this.margins.find(([, margins]) => (this.page_margins == margins));
            return margins ? margins[0] : this.page_margins;
        },
        margins: () => [
            ["Medium", "20mm"],
            ["Small", "15mm"],
            ["Slim", "10mm 15mm"],
            ["Tiny", "5mm"]
        ],

        // Current text style management
        current_text_style() { return this.mounted ? this.$refs.editor.current_text_style : false; },
        isLeftAligned() { return ["start", "left", "-moz-left"].includes(this.current_text_style.textAlign); },
        isRightAligned() { return ["end", "right", "-moz-right"].includes(this.current_text_style.textAlign); },
        isCentered() { return ["center", "-moz-center"].includes(this.current_text_style.textAlign); },
        isJustified() { return ["justify", "justify-all"].includes(this.current_text_style.textAlign); },
        isBold() {
            const fontWeight = this.current_text_style.fontWeight;
            return fontWeight && (parseInt(fontWeight) > 400 || fontWeight.indexOf("bold") == 0);
        },
        isItalic() { return this.current_text_style.fontStyle == "italic"; },
        isUnderline() { // text-decoration is not overridden by children, so we query the parent stack
            const stack = this.current_text_style.textDecorationStack;
            return stack && stack.some(d => (d.indexOf("underline") == 0));
        },
        isStrikeThrough() { // text-decoration is not overridden by children, so we query the parent stack
            const stack = this.current_text_style.textDecorationStack;
            return stack && stack.some(d => (d.indexOf("line-through") == 0));
        },
        isNumberedList() { return this.current_text_style.isList && this.current_text_style.listStyleType == "decimal"; },
        isBulletedList() { return this.current_text_style.isList && ["disc", "circle"].includes(this.current_text_style.listStyleType); },
        isH1() { return this.current_text_style.headerLevel == 1; },
        isH2() { return this.current_text_style.headerLevel == 2; },
        isH3() { return this.current_text_style.headerLevel == 3; },
        curColor() { return this.current_text_style.color || "transparent"; },

        // Platform management
        isMacLike: () => /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform),

        // Undo / redo flags
        can_undo() { return this.undo_count > 0; },
        can_redo() { return this.content_history.length - this.undo_count - 1 > 0; }
    },

    methods: {
        // Page overlays (headers, footers, page numbers)
        overlay(page, total) {
            // Add page numbers on each page
            let html = '<div style="position: absolute; bottom: 8mm; ' + ((page % 2) ? 'right' : 'left') + ': 10mm">Page ' + page + ' of ' + total + '</div>';

            // Add custom headers and footers from page 3
            if (page >= 3) {
                html += '<div style="position: absolute; left: 0; top: 0; right: 0; padding: 3mm 5mm; background: rgba(200, 220, 240, 0.5)"><strong>MYCOMPANY</strong> example.com /// This is a custom header overlay</div>';
                html += '<div style="position: absolute; left: 10mm; right: 10mm; bottom: 5mm; text-align:center; font-size:10pt">MY COMPANY - example.com /// This is a custom footer overlay</div>';
            }
            return html;
        },

        // Undo / redo functions examples
        undo() { if (this.can_undo) { this._mute_next_content_watcher = true; this.content = this.content_history[--this.undo_count]; } },
        redo() { if (this.can_redo) { this._mute_next_content_watcher = true; this.content = this.content_history[++this.undo_count]; } },
        resetContentHistory() { this.content_history = []; this.undo_count = -1; },

        // Insert page break function example
        async insertPageBreak() {
            // insert paragraph at caret position
            document.execCommand("insertParagraph");

            // insert a marker at caret position (start of the new paragraph)
            const marker = "###PB###"; // must be regex compatible
            document.execCommand("insertText", false, marker);

            // wait for v-model content update (two ticks are needed to reactivate watch on content)
            await this.$nextTick();
            await this.$nextTick();

            // find the marker inside content items and split this content item in two items between the two paragraphs
            // only match root tags (p, div, h1, h2...) to avoid non-root tags like <li>
            const regexp = new RegExp("<(p|div|h\\d)( [^/>]+)*>(<[^/>]+>)*" + marker);
            for (let i = 0; i < this.content.length; i++) {
                const item = this.content[i];
                if (typeof item != "string") continue;
                const match = regexp.exec(item);
                if (match) {
                    const tags_open = match[0].slice(0, -marker.length);
                    let content_plus_tags_close = item.substr(match.index + match[0].length);
                    // insert <br> to empty pages that would not be handled correctly by contenteditable
                    if (content_plus_tags_close.indexOf("</") == 0) content_plus_tags_close = "<br>" + content_plus_tags_close;
                    this.content.splice(i, 1, item.substr(0, match.index), tags_open + content_plus_tags_close);
                    return;
                }
            }

            // if the code didn't return before, the split didn't work (e.g. inside a <li>). just remove the marker from the content
            for (let i = 0; i < this.content.length; i++) {
                const item = this.content[i];
                if (typeof item != "string" || item.indexOf(marker) < 0) continue;
                this.content.splice(i, 1, item.replace(marker, ''));
                break;
            }
        }
    },

    watch: {
        content: {
            immediate: true,
            // Fill undo / redo history stack on user input
            handler(new_content) {
                if (!this._mute_next_content_watcher) { // only update the stack when content is changed by user input, not undo/redo commands
                    this.content_history[++this.undo_count] = new_content;
                    this.content_history.length = this.undo_count + 1; // remove all redo items
                }
                this._mute_next_content_watcher = false;
            }
        }
    }
}
</script>

<style>
html {
    height: 100%;
}

body {
    margin: 0;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: black;
    background: rgb(248, 249, 250);
}

::-webkit-scrollbar {
    width: 16px;
    height: 16px;
}

::-webkit-scrollbar-track,
::-webkit-scrollbar-corner {
    display: none;
}

::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.5);
    border: 5px solid transparent;
    border-radius: 16px;
    background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.8);
}
</style>

<style scoped>
.main {
    width: fit-content;
    min-width: 100%;
}

.bar {
    position: sticky;
    left: 0;
    top: 0;
    width: calc(100vw - 16px);
    z-index: 1000;
    background: rgba(248, 249, 250, 0.8);
    border-bottom: solid 1px rgb(248, 249, 250);
    backdrop-filter: blur(10px);
    --bar-button-active-color: #188038;
    --bar-button-open-color: #188038;
    --bar-button-active-bkg: #e6f4ea;
    --bar-button-open-bkg: #e6f4ea;
}
</style>