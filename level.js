function level_t(pos)
{
	var _this=this;

	_this.crates=[];
	_this.hovers=[];


	for(var ii=0;ii<13;++ii)
	{
		_this.crates.push(new crate_t(pos.x+16*ii,pos.y+64));
		if(ii==0||ii==12)
			_this.crates.push(new crate_t(pos.x+16*ii,pos.y+64-16));
	}

	_this.hovers.push(new hover_t(120,120));
	_this.hovers.push(new hover_t(260,190));

	_this.loop=function(simulation,dt,level)
	{
		for(var ii=0;ii<_this.crates.length;++ii)
			_this.crates[ii].loop(simulation,dt,level);
		for(var ii=0;ii<_this.hovers.length;++ii)
			_this.hovers[ii].loop(simulation,dt,level);
	}

	_this.draw=function(simulation)
	{
		for(var ii=0;ii<_this.crates.length;++ii)
			_this.crates[ii].draw(simulation);
		for(var ii=0;ii<_this.hovers.length;++ii)
			_this.hovers[ii].draw(simulation);
	};
};