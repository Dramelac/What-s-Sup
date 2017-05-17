import json
from channels import Group
from channels.auth import channel_session_user_from_http, channel_session_user
from models import User, Pub_key


@channel_session_user_from_http
def ws_connect(message):
    Group(str(message.user.id)).add(message.reply_channel)
    message.channel_session['room'] = str(message.user.id)
    message.reply_channel.send({"accept": True})


@channel_session_user
def ws_message(message):
    data = json.loads(message.content['text'])
    receiver = str(data['to'])
    data['sender'] = str(message.user.id)
    Group(receiver).send({
        "text": json.dumps(data),
    })


@channel_session_user
def ws_disconnect(message):
    room = message.channel_session['room']
    Group(room).discard(message.reply_channel)
    user = User.objects.get(id=message.user.id)
    db_pub_key = Pub_key.objects.get(user=user)
    db_pub_key.delete()
