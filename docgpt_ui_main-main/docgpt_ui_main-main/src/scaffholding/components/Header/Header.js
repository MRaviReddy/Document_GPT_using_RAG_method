import React, {Component} from "react";
import styles from "./Header.module.css";

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "Doc GPT"            
        }
    }

    render() {
        return (
            <div className={styles.headerSection}>
                <div className={styles.appName}>{this.state.name}</div>                
            </div>
        );
    }
}
