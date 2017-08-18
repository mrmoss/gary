function crate_t(x,y)
{
	this.parent=new block_t(x,y,0,0);
	this.added=false;
	this.spr=new sprite_t('img/crate.png',1);
}

crate_t.prototype.loop=function(simulation,dt,level)
{
	if(!simulation)
		return;

	if(!this.added)
	{
		level.blocks.push(this.parent);
		this.added=true;
	}

	this.parent.width=this.spr.width;
	this.parent.height=this.spr.height;
}

crate_t.prototype.draw=function(simulation)
{
	if(!simulation)
		return;

	simulation.ctx.save();
	simulation.ctx.translate(this.parent.x,this.parent.y);
	this.spr.draw(simulation);
	simulation.ctx.restore();
}