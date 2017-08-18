function crate_t(x,y)
{
	this.x=x;
	this.y=y;
	this.width=0;
	this.height=0;
	this.spr=new sprite_t('img/crate.png',1);
}

crate_t.prototype.loop=function(simulation,dt,level)
{
	if(!simulation)
		return;

	this.width=this.spr.width;
	this.height=this.spr.height;
}

crate_t.prototype.draw=function(simulation)
{
	if(!simulation)
		return;

	simulation.ctx.save();
	simulation.ctx.translate(this.x,this.y);
	this.spr.draw(simulation);
	simulation.ctx.restore();
}