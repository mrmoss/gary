var kb_left=37;
var kb_up=38;
var kb_right=39;
var kb_down=40;

function get_left(obj)
{
	return -obj.width/2.0;
}

function get_right(obj)
{
	return obj.width/2.0;
}

function get_bottom(obj)
{
	return obj.height/2.0-obj.height_offset;
}

function get_top(obj)
{
	return -obj.height/2.0-obj.height_offset;
}

function check_collision_pos(obj1,x,y,obj2)
{
	return (x+get_right(obj1)>=obj2.x+get_left(obj2)&&
		x+get_left(obj1)<=obj2.x+get_right(obj2)&&
		y+get_bottom(obj1)>=obj2.y+get_top(obj2)&&
		y+get_top(obj1)<=obj2.y+get_bottom(obj2));
}

function check_collision_beneath_pos(obj1,x,y,obj2)
{
	var obj1_bottom=y+get_bottom(obj1);
	var obj2_top=obj2.y+get_top(obj2);

	return (x+get_right(obj1)>=obj2.x+get_left(obj2)&&
		x+get_left(obj1)<=obj2.x+get_right(obj2)&&
		obj1_bottom>=obj2_top&&obj1_bottom-obj2_top<1&&
		obj2_top<=obj1_bottom);
}

function canvas_t(canvas_obj,setup_func,loop_func,draw_func)
{
	var _this=this;

	_this.canvas=canvas_obj;
	_this.old_time=new Date();
	_this.user_setup=setup_func;
	_this.user_loop=loop_func;
	_this.user_draw=draw_func;
	_this.ctx=null;
	_this.keys_down=[];
	_this.keys_pressed=[];
	_this.keys_released=[];

	_this.setup=function()
	{
		if(!_this.canvas)
			return false;

		_this.ctx=_this.canvas.getContext("2d");

		if(!_this.ctx)
			return false;

		for(var ii=0;ii<255;++ii)
		{
			_this.keys_down[ii]=false;
			_this.keys_pressed[ii]=false;
			_this.keys_released[ii]=false;
		}

		_this.user_setup();
		_this.loop();

		window.addEventListener("keydown",_this.keydown,true);
		window.addEventListener("keyup",_this.keyup,true);

		return true;
	};

	_this.keydown=function(evt)
	{
		if(!_this.keys_down[evt.keyCode])
			_this.keys_pressed[evt.keyCode]=true;

		_this.keys_down[evt.keyCode]=true;
	};

	_this.keyup=function(evt)
	{
		_this.keys_released[evt.keyCode]=true;
		_this.keys_down[evt.keyCode]=false;
	};

	_this.draw=function()
	{
		if(_this.canvas&&_this.ctx&&_this.user_draw)
		{
			_this.ctx.globalCompositeOperation="destination-over";
			_this.ctx.clearRect(0,0,_this.canvas.width,_this.canvas.height);
			_this.user_draw();
			_this.ctx.restore();
		}
	};

	_this.loop=function()
	{
		if(_this.user_loop&&_this.old_time&&_this.loop&&_this.draw)
		{
			var new_time=new Date();
			_this.user_loop(Math.min((new_time-_this.old_time)/1000.0,0.1));
			_this.old_time=new_time;
			_this.draw();
		}

		for(var ii=0;ii<255;++ii)
		{
			_this.keys_pressed[ii]=false;
			_this.keys_released[ii]=false;
		}

		window.requestAnimationFrame(function(){_this.loop();});
	};
};