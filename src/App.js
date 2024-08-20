import { Box, Heading, Container } from '@chakra-ui/react';
import Notifications from './components/Notifications';
import Options from './components/Options';
import VideoPlayer from './components/VideoPlayer';
import JoinRoomComponent from './components/JoinRoomComponent';
import VideoStreamComponent from './components/VideoStreamComponent';
import VideoDisplayComponent from './components/VideoDisplayComponent';

function App() {
    return (
        <Box>
          <Container maxW="1200px" mt="8">
            <Heading as="h2" size="2xl"> Video Chat App </Heading>
            <VideoPlayer />
            <Options />
            <Notifications />
            {/* <JoinRoomComponent/>
            <VideoStreamComponent/>
            <VideoDisplayComponent/> */}
          </Container>
        </Box>
    );
}
export default App;
