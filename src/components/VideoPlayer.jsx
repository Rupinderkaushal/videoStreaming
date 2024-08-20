    
// import { Grid, Box, Heading } from "@chakra-ui/react"
// import { SocketContext } from "../Context"
// import { useContext } from "react"

// const VideoPlayer = () => {
//     const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext)

// return (
//     <Grid justifyContent="center" templateColumns='repeat(2, 1fr)' mt="12">
//             {/* my video */}
//         {
//             stream && (
//                 <Box>
//                     <Grid colSpan={1}>
//                         <Heading as="h5">
//                             {name || 'Name'}
//                         </Heading>
//                         <video playsInline muted ref={myVideo} autoPlay width="600" />
//                     </Grid>
//                 </Box>
//             )
//         }
//               {/* user's video */}
//         {
//             callAccepted && !callEnded && (
//                 <Box>
//                     <Grid colSpan={1}>
//                         <Heading as="h5">
//                             {call.name || 'Name'}
//                         </Heading>
//                         <video playsInline ref={userVideo} autoPlay width="600" />
//                     </Grid>
//                 </Box>
//             )
//         }
//     </Grid>
// )
// }
//     export default VideoPlayer
//
import { Grid, Box, Heading } from "@chakra-ui/react";
import { SocketContext } from "../Context";
import { useContext } from "react";

const VideoPlayer = () => {
    const { name, myVideo, videoRefs, peers, stream } = useContext(SocketContext);
    console.log('peers--',peers)

    return (
        <Grid justifyContent="center" templateColumns='repeat(auto-fit, minmax(300px, 1fr))' gap={4} mt="12">
            {/* My video */}
            {stream && (
                <Box>
                    <Heading as="h5" mb={2}>
                        {name || 'Name'}
                    </Heading>
                    <video playsInline muted ref={myVideo} autoPlay style={{ width: '100%' }} />
                </Box>
            )}

            {/* Other users' videos */}
            {peers?.map((peer, index) => (
                <Box key={peer.id}>
                    <Heading as="h5" mb={2}>
                        {peer.name || `User ${index + 1}`}
                    </Heading>
                    <video playsInline ref={videoRefs.current[peer.id]} autoPlay style={{ width: '100%' }} />
                </Box>
            ))}
        </Grid>
    );
};

export default VideoPlayer;
