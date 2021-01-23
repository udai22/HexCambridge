import React from 'react';

function Title(props) {
    const titleStyle = {
        textAlign: "center",
        marginBottom: "0",
    };
    return (
        <div>
            <h1 style={titleStyle}>Covid-19 Hospital Impact Dashboard</h1>
        </div>
    );
}

export default Title;