import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("annotate");
    }

    async getHtml() {
        return `
            <h1>Annotator</h1>
            <p>Start annotating images here</p>

            <input id="upload" type="file" onchange="handleImageUpload()"/>

            </br>
            <div>
                <img class="imgToAnnot" id="annoImg" src=""/>
            </div>
        `;
    }
}