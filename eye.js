function eye_t(parent)
{
	this.parent=parent;
	this.x=0;
	this.y=0;
	this.xoff=0;
	this.yoff=0;
	this.max_dist=0;
	this.spr=new sprite_t('eye.png',1,true,true);
}

eye_t.prototype.loop=function(simulation,dt,level)
{
	this.x=this.parent.x+this.xoff;
	this.y=this.parent.y+this.yoff;

	var dir=point_direction(this.x,this.y,level.player.x,level.player.y);
	var dist=Math.min(this.max_dist,point_distance(this.x,this.y,level.player.x,level.player.y)/50.0);

	this.x+=Math.cos(dir)*dist;
	this.y+=Math.sin(dir)*dist;
}

eye_t.prototype.draw=function(simulation)
{
	if(!simulation)
		return;

	simulation.ctx.save();
	simulation.ctx.translate(this.x,this.y);
	this.spr.draw(simulation);
	simulation.ctx.restore();
}