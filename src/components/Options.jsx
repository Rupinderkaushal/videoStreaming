
// import { useState, useContext } from "react"
// import { Button, Input, FormLabel, Heading, Grid, Box, Container, FormControl } from "@chakra-ui/react"
// import { CopyToClipboard } from 'react-copy-to-clipboard';
// import { BiClipboard, BiPhoneCall, BiPhoneOff } from "react-icons/bi";
// import { SocketContext } from "../Context";
    
// const Options = () => {
//     const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(SocketContext);
//     const [idToCall, setIdToCall] = useState('');

// return (
//     <Container maxW="1200px" m="35px 0" p="0">
//         <Box p="10px" border="2px" borderColor="black" borderStyle="solid">
//             <FormControl display="flex" flexDirection="column" noValidate aria-autocomplete="none">
//                 <Grid templateColumns='repeat(2, 1fr)' mt="12">
//                     <Grid colSpan={1} p="6">
//                         <Heading as="h6"> Account Info </Heading>
//                         <FormLabel>Username</FormLabel>
//                         <Input type='text' value={name} onChange={(e) => setName(e.target.value)} width="100%" />
//                         <CopyToClipboard text={me} mt="20">
//                             <Button leftIcon={<BiClipboard />} colorScheme='teal' variant='solid'>
//                                 Copy ID
//                             </Button>
//                         </CopyToClipboard>
//                     </Grid>
//                     <Grid colSpan={1} p="6">
//                         <Heading as="h6"> Make a Call </Heading>
//                         <FormLabel> User id to call </FormLabel>
//                         <Input type='text' value={idToCall} onChange={(e) => setIdToCall(e.target.value)} width="100%" />
//                         {
//                             callAccepted && !callEnded ? (
//                                 <Button leftIcon={<BiPhoneOff />} onClick={leaveCall} mt="20" colorScheme='teal' variant='info'>
//                                     Hang up
//                                 </Button>
//                             ) : (
//                                 <Button leftIcon={<BiPhoneCall />} onClick={() => callUser(idToCall)} mt="20" colorScheme='teal' variant='solid'>
//                                     Call
//                                 </Button>
//                             )
//                         }
//                     </Grid>
//                 </Grid>
//             </FormControl>
//         </Box>
//     </Container>
// )
// }
// export default Options
//
import { useState, useContext } from "react";
import { Button, Input, FormLabel, Heading, Grid, Box, Container, FormControl } from "@chakra-ui/react";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { BiClipboard, BiPhoneCall, BiPhoneOff } from "react-icons/bi";
import { SocketContext } from "../Context";

const Options = () => {
    const { me, callAccepted, name, setName, callEnded, leaveCall, callUser, peers } = useContext(SocketContext);
    const [idsToCall, setIdsToCall] = useState('');

    console.log("ids-to-call",idsToCall)

    const handleCall = () => {
        const idsArray = idsToCall.split(',').map(id => id.trim());
        idsArray.forEach(id => callUser(id));
    };

    return (
        <Container maxW="1200px" m="35px 0" p="0">
            <Box p="10px" border="2px" borderColor="black" borderStyle="solid">
                <FormControl display="flex" flexDirection="column" noValidate aria-autocomplete="none">
                    <Grid templateColumns='repeat(2, 1fr)' mt="12">
                        <Grid colSpan={1} p="6">
                            <Heading as="h6"> Account Info </Heading>
                            <FormLabel>Username</FormLabel>
                            <Input type='text' value={name} onChange={(e) => setName(e.target.value)} width="100%" />
                            <CopyToClipboard text={me} mt="20">
                                <Button leftIcon={<BiClipboard />} colorScheme='teal' variant='solid'>
                                    Copy ID
                                </Button>
                            </CopyToClipboard>
                        </Grid>
                        <Grid colSpan={1} p="6">
                            <Heading as="h6"> Make a Call </Heading>
                            <FormLabel> User IDs to call (comma-separated) </FormLabel>
                            <Input 
                                type='text' 
                                value={idsToCall} 
                                onChange={(e) => setIdsToCall(e.target.value)} 
                                placeholder="Enter user IDs separated by commas" 
                                width="100%" 
                            />
                            {callAccepted && !callEnded ? (
                                <Button 
                                    leftIcon={<BiPhoneOff />} 
                                    onClick={leaveCall} 
                                    mt="20" 
                                    colorScheme='teal' 
                                    variant='solid'>
                                    Hang up
                                </Button>
                            ) : (
                                <Button 
                                    leftIcon={<BiPhoneCall />} 
                                    onClick={handleCall} 
                                    mt="20" 
                                    colorScheme='teal' 
                                    variant='solid'>
                                    Call
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </FormControl>
            </Box>
        </Container>
    );
};

export default Options;
