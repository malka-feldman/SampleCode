import { useState, useEffect } from 'react';
import io from 'socket.io-client'; //allows communication with a WebSocket server

const useSocketData = () => {
    const [allData, setAllData] = useState([]);

    useEffect(() => {
        const socket = io.connect(' ', { forceNew: true }); //connects to websocket server on specific port address

        socket.on('socketData', (dataToSend) => {
            let controllerIdStarted = false;
            const newData = dataToSend
                .split('#')
                .map(mc => {
                    const split = mc.trim().split(' ');
                    let controllerId = split.shift(); // Extract controller ID
                    if (!controllerIdStarted && controllerId !== "") {
                        controllerIdStarted = true;
                    }
                    if (!controllerIdStarted) {
                        return null; // Skip data until a valid controller ID is found
                    }
                    /*Reduce method used to transform the array of data into a single object 
                    by iteratively splitting each string and adding the resulting key-value 
                    pairs to an accumulator object. This way the data can be accessed 
                    using Object Properties(keys) */
                    const data = split.reduce((accumulator, currentValue) => {
                        const [key, value] = currentValue.split('=');
                        accumulator[key] = value;
                        return accumulator;
                    }, {}); // Collect all key-value pairs

                    return {controllerId, ...data };
                })
                .filter(data => data !== null); // Filter out null values

            setAllData(newData);
        });

        return () => {
            socket.disconnect();
        };
    }, []); //Runs only once when the component mounts

    return allData;
};

export default useSocketData;