function crate_t(x,y)
{
	var _this=this;

	_this.x=x;
	_this.y=y;
	_this.spr=new sprite_t("crate.png",1);

	_this.loop=function(simulation,dt,level)
	{
		if(!simulation)
			return;

		_this.height=_this.spr.height;
		_this.height_offset=0;
	}

	_this.draw=function(simulation)
	{
		if(!simulation)
			return;

		simulation.ctx.save();
		simulation.ctx.translate(_this.x,_this.y);
		_this.spr.draw(simulation);
		simulation.ctx.restore();
	};
};