local cjson = require "cjson.safe";

ngx.req.read_body();
local post_args = ngx.req.get_post_args();
local bus = cjson.decode(post_args.apibus);

local methods = {
    GET = ngx.HTTP_GET,
    POST = ngx.HTTP_POST,
    PUT = ngx.HTTP_PUT,
    DELETE = ngx.HTTP_DELETE
};

local seats = {};
local seat;
local options;
for k, v in pairs(bus) do
    seat = {v.url};
    options = {};
    
    if v.method then
        options['method'] = methods[string.upper(v.method)];
    end
    if v.params then
        options['args'] = v.params;
    end
    if v.body then
        options['body'] = v.body;
    end
    
    if table.getn(options) then
        table.insert(seat, 2, options);
    end
    
    table.insert(seats, k, seat);
end

local responses = {ngx.location.capture_multi(seats)};

local bus = {};
local res;
for k, v in pairs(responses) do
    if v.status == 200 then
        res = cjson.decode(v.body);
    else
        res = "error";
    end
    
    table.insert(bus, k, res);
end

ngx.say(cjson.encode(bus));