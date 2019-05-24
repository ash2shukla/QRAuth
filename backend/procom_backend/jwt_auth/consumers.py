from channels.generic.websocket import JsonWebsocketConsumer
from qrcode import make
from io import BytesIO
from datetime import datetime
from base64 import b64encode
from .utils import create_new_session
from asgiref.sync import async_to_sync
from logging import getLogger
from json import loads


logger = getLogger(__name__)


class AuthedConsumer(JsonWebsocketConsumer):
    """
    Handles authenticated sessions.
    """
    def connect(self):
        if self.scope['user']:
            self.accept()
        else:
            slf.close()

    def receive_json(self, content):
        if isinstance(content, str):
            content = loads(content)

        if content.get('event') == 'activate_session':
            to_channel = content.get('to_channel')
            token, refresh_token, session_key = create_new_session(self.scope['user'].username)

            logger.debug(f"QR SIGNIN user {self.scope['user'].username} session_key {session_key}")
            
            async_to_sync(self.channel_layer.send)(to_channel, {
                "type": "send.created.session",
                "token": token,
                "refresh_token": refresh_token,
                "session_key": session_key,
            })
    
    def disconnect(self, close_code):
        print(close_code)


class AnonConsumer(JsonWebsocketConsumer):
    """
    Handles anonymous sessions for QR codes on web apps.

    Frontend must implement logic to redirect to corresponding dashboard after receiving "acitvate_session" event.
    """
    def connect(self):
        self.accept()
    
    def receive_json(self, content):
        if isinstance(content, str):
            content = loads(content)

        now = datetime.utcnow().timestamp()
        text = ':'.join([self.channel_name, str(now)])
        buffer = BytesIO()
        make(text).save(buffer)
        qr = b64encode(buffer.getvalue()).decode()
        if content.get('event') == 'qr':
            logger.debug(f"sent QR to channel_id: {self.channel_name}")
            self.send_json({'event': 'login_qr', 'qr': qr})

    def send_created_session(self, session_data):
        self.send_json({'event': 'activate_session', 'session_data': session_data})
