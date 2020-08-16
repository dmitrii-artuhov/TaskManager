// Socket IO
import SocketIO from "socket.io-client";
import { BaseURL } from './config.json';

const socket = SocketIO(BaseURL);

export default socket;