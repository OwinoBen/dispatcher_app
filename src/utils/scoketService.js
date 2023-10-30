import io from 'socket.io-client';

class WSService {
    initializeSocket = async(socketUrl) => {
        try {
            this.socket = io(socketUrl, {
                transports: ['websocket'],
            });
            this.socket.on('connect', (data) => {
                console.log('===== socket connected =====');
            });
            this.socket.on('disconnect', () => {
                console.log('socket disconnected');
            });
            this.socket.on('socketError', (err) => {
                console.log('socket connection error: ',err);
                // logger.data('socket connection error: ', err);
            });
            this.socket.on("parameterError",()=>{
                console.log('socket connection error: ', err);
              })

            this.socket.on('error', (error) => {
                console.log(error,'thea data');
            });

        } catch (error) {
            console.log(error,'hter tereo');
        }
    };

    emit(event, data = {}) {
        this.socket.emit(event, data);
    }

    on(event, cb) {
        this.socket.on(event, cb);
    }


    removeListener(listenerName) {
        this.socket.removeListener(listenerName);
    }
}

const socketServices = new WSService();

export default socketServices;