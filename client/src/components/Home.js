import React from 'react';
import { useHomePageStyles } from '../styles/muiStyles';
import AC from '../media/ac.gif';

const Home = () => {
    const classes = useHomePageStyles();

    return (
        <div className={classes.root}>
            <center>
                <img className={classes.gif} src={AC} />
            </center>
        </div>
    );
}

export default Home;