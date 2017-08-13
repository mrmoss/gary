function sprite_t(source,frames)
{
	var _this=this;

	_this.image=new Image();
	_this.image.src=source;
	_this.frame=0;
	_this.frame_count=frames;
	_this.x_scale=1;
	_this.y_scale=1;
	_this.width=_this.image.width/_this.frame_count;
	_this.height=_this.image.height;

	_this.draw=function(simulation)
	{
		if(_this.frame>=_this.frame_count)
			_this.frame=0;

		_this.width=_this.image.width/_this.frame_count;
		_this.height=_this.image.height;

		if(!simulation)
			return;

		simulation.ctx.save();
		simulation.ctx.translate(-(_this.width/2.0*_this.x_scale),-(_this.height/2.0*_this.y_scale));
		simulation.ctx.scale(_this.x_scale,_this.y_scale);

		simulation.ctx.drawImage(_this.image,
			Math.floor(_this.frame)*_this.width,
			0,
			_this.width,
			_this.height,
			0,
			0,
			_this.width,
			_this.height);

		simulation.ctx.restore();
	};
};