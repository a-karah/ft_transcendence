import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Row, Col , Card } from 'react-bootstrap'
import ChannelList from '../components/channel/ChannelList'
import ChannelMembers from '../components/channel/ChannelMembers'
import ChannelChat from '../components/channel/ChannelChat'
import '../css/channel.css'


export default function Channel({ showInvite, setShowInvite }){
	const { socket } = useAuth()
	const [currentChannel, setCurrentChannel] = useState(-1)
	const [myChannels, setMyChannels] = useState([])
	const [allChannels, setAllChannels] = useState([])

	
	useEffect(() => {
		socket.emit('GET_ALL', {})
		socket.addEventListener('GET_ALL', (data) => {
			const parsed = JSON.parse(data)
			console.log('get all')
			setMyChannels(parsed.my_channels)
			setAllChannels(parsed.all_channels)
		})
	// eslint-disable-next-line
	}, [])
	
	return(
		<>
			<Card>
				<Card.Body id="channel-card">
					<Row className="border-between">
						<Col  className="col-2 channel-col" style={{
							borderRight: "1px solid #ccc",
							overflowY:'auto'
						}}>
							<ChannelList allChannels={allChannels}  myChannels={myChannels}  setCurrentChannel={setCurrentChannel}  />
						</Col>
						<Col className="col-7" style={{overflowY:'auto'}}>
							{myChannels[currentChannel] === undefined ? '' : (
								<ChannelChat myChannels={myChannels}  currentChannel={currentChannel}/>
							)}				
						</Col>
						<Col className="col-3" style={{
							borderLeft: "1px solid #ccc",
							overflowY:'auto'
						}}>
							{myChannels[currentChannel] === undefined ? '' : (
								<ChannelMembers showInvite={showInvite}  setShowInvite={setShowInvite}  myChannels={myChannels} currentChannel={currentChannel}  />
							)}				
						</Col>
					</Row>
				</Card.Body>		
			</Card>

		</>
		
	)
}