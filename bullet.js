function bullet_t(x,y)
{
	this.x=x;
	this.y=y;
	this.width=0;
	this.height=0;
	this.dir=1;
	this.spr=new sprite_t('bullet.png',4);
	this.speed=150;
	this.animation_speed=20;
	this.moved_dist=0;
	this.destroy=false;
}

bullet_t.prototype.loop=function(simulation,dt,level)
{
	if(!simulation)
		return;

	this.width=8;
	this.height=this.spr.height;

	this.spr.x_scale=this.dir;
	this.spr.frame+=this.animation_speed*dt;
	this.x+=this.speed*this.dir*dt;
	this.moved_dist+=Math.abs(this.speed*this.dir*dt);

	var _this=this;
	var collision_func=function(objects,centered,cb)
	{
		if(!_this.destroy)
			for(var ii=0;ii<objects.length;++ii)
				if(!objects[ii].broken&&check_collision_pos(_this,_this.x-_this.width/2+objects[ii].width/2*centered,_this.y,objects[ii]))
				{
					_this.destroy=true;
					if(cb)
						cb(objects[ii]);
					break;
				}
	};

	collision_func(level.crates,0,null);
	collision_func(level.garys,1,null);
	collision_func(level.breakables,1,function(other){other.shatter();});

	//for(var ii=0;ii<level.garys.length;++ii)
	//	for(var jj=0;jj<level.garys[ii].tenticles.length;++jj)
	//	{
	//		console.log(level.garys[ii].tenticles[jj].segments.length);
	//		collision_func(level.garys[ii].tenticles[jj].segments,1);
	//	}
}

bullet_t.prototype.draw=function(simulation)
{
	if(!simulation)
		return;

	simulation.ctx.save();
	simulation.ctx.translate(this.x-this.spr.width/2.0*this.spr.x_scale,this.y);
	this.spr.draw(simulation);
	simulation.ctx.restore();
};