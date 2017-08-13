function hover_t(x,y)
{
	var _this=this;

	_this.x=x;
	_this.y=y;
	_this.width=0;
	_this.height=0;
	_this.height_offset=0;
	_this.spr=new sprite_t("hover.png",4);
	_this.animation_speed=10;
	_this.speed=20;
	_this.direction=-1;
	_this.start_pos=x;
	_this.max_dist=128;
	_this.move_with=null;

	_this.loop=function(simulation,dt,level)
	{
		if(!simulation)
			return;


		_this.width=_this.spr.width;
		_this.height=8;
		_this.height_offset=(_this.spr.height-_this.height)/2;
		_this.spr.frame+=_this.animation_speed*dt;

		_this.x+=_this.speed*_this.direction*dt;
		if(_this.move_with)
			_this.move_with.x+=_this.speed*_this.direction*dt;

		if(_this.x>_this.start_pos+_this.max_dist/2)
			_this.direction=-1;
		if(_this.x<_this.start_pos-_this.max_dist/2)
			_this.direction=1;
	}

	_this.draw=function(simulation)
	{
		simulation.ctx.save();
		simulation.ctx.translate(_this.x,_this.y);
		_this.spr.draw(simulation);
		simulation.ctx.restore();
	};
};