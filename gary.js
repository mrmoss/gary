function gary_t(x,y)
{
	this.x=x;
	this.y=y;
	this.width=0;
	this.height=0;
	this.spr=new sprite_t("gary.png",2);
	this.direction=1;
};

gary_t.prototype.loop=function(simulation,dt,level)
{
	if(!simulation)
		return;

	this.width=22;
	this.height=this.spr.height;
};

gary_t.prototype.draw=function(simulation)
{
	if(!simulation)
		return;

	simulation.ctx.save();
	simulation.ctx.translate(this.x,this.y);
	this.spr.draw(simulation);
	simulation.ctx.restore();
};