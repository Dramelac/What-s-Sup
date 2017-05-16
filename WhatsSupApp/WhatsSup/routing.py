from channels.routing import route
from WhatsSup.consumers import ws_message


channel_routing = [
    route("websocket.receive", ws_message),
    # route('websocket.disconnect', test),
]