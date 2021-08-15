import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("annotate");
    }

    async getHtml() {
        return `
            <h1>Posts</h1>
            <p>You are viewing the posts!</p>

            <input id="upload" type="file" onchange="handleImageUpload()"/>

            </br>
            <div>
                <img id="annoImg" src=""/>
            </div>
        `;
    }
}