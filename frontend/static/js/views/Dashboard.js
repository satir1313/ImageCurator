import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Dashboard");
    }

    async getHtml() {
        return `
            <h1>Image Annotator Application From ShieldTec</h1>
            <p>
                This Web application will allow user to uplaod image, and after annotate that use fro machin learning purposes.
            </p>
            <p>
                <a href="/annotate" data-link>Start Annotate Image</a>
            </p>
        `;
    }
}