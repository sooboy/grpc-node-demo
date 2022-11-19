import { handleUnaryCall, Server, ServerCredentials,UntypedServiceImplementation } from "@grpc/grpc-js";
import { HandleCall, sendUnaryData, ServerDuplexStream, ServerUnaryCall, ServerWritableStream } from "@grpc/grpc-js/build/src/server-call";

import {
	IEchoServiceServer,
	EchoServiceService,
} from "./proto/generated/hello_grpc_pb";
import { EchoMessage } from "./proto/generated/hello_pb";

// const echoServer: IEchoServiceServer = {
// 	echo(call, callback) {
// 		console.log(call.request.getMessage());
// 		callback(null, call.request);
// 	},
// 	echoStream(call) {
// 		call.on("data", (data) => {
// 			console.log(data.getMessage());
// 			call.write(data);
// 		});
// 		call.on("end", () => {
// 			call.end();
// 		});
// 		call.on("error", (err) => {
// 			call.emit("error", err);
// 		});
// 	},
// };
export class BaseService implements UntypedServiceImplementation {
    [name: string]: HandleCall<any, any>
  }

class EchoServer extends BaseService implements IEchoServiceServer {
	echo(
        call:ServerUnaryCall<EchoMessage,EchoMessage>,
        callback:sendUnaryData<EchoMessage>
    ) {
		console.log(call.request.getMessage());
		callback(null, call.request);
	}
	echoStream(call:ServerDuplexStream<EchoMessage,EchoMessage>) {
		call.on("data", (data) => {
			console.log(data.getMessage());
			call.write(data);
		});
		call.on("end", () => {
			call.end();
		});
		call.on("error", (err) => {
			call.emit("error", err);
		});
	}
}

const main = async () => {
	const server = new Server();
	server.addService(EchoServiceService, new EchoServer());
	server.bindAsync(
		"0.0.0.0:8080",
		ServerCredentials.createInsecure(),
		(err, port) => {
			if (err) {
				console.error(err);
			} else {
				server.start();
                console.log("has start")
			}
		}
	);
};

main();
