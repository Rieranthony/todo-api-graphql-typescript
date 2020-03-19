import * as bunyan from "bunyan";

export default bunyan.createLogger({
  name: "todo-server",
  level: "info"
  // streams: [
  //   {
  //     path: '/logs/server.log',
  //     period: '1d', // daily rotation
  //     count: 3, // keep 3 back copies
  //   },
  // ],
});
