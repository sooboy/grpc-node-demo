import { EchoServiceClient } from './proto/generated/hello_grpc_pb';
import { EchoMessage } from './proto/generated/hello_pb'
import { credentials } from '@grpc/grpc-js';

const sleep  = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const testEcho = async (c:EchoServiceClient) => { 
    const req = new EchoMessage();
    req.setMessage('Hello, World!');
    c.echo(req, (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.log(res?.getMessage());
        }
    })
}

const testEchoStream = async (c:EchoServiceClient) => {
    const call = c.echoStream();
    call.on('data', (data) => {
        console.log(data.getMessage());
    })
    call.on('end', () => {
        console.log('end');
    })

    for (let i = 0; i < 10; i++) {
        const req = new EchoMessage();
        req.setMessage(`Hello, World! ${i}`);
        call.write(req);
        await sleep(1000);
    }

    call.end()
}

const main = async () => {
    const c = new EchoServiceClient('localhost:8080', credentials.createInsecure());
    // await testEcho(c);
    await testEchoStream(c);
}
main();