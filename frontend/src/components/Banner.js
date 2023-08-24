import React from "react";

const Banner = () => {
	return (
		<div className='min-h-[80vh] banner w-full relative'>
			<div className='overlay'></div>
			<div className='container relative z-10 py-20'>
				<div className='flex items-stretch justify-center'>
					{/* img  */}
					<div className='basis-1/2'>
						<img
							src='https://websitedemos.net/organic-shop-02/wp-content/uploads/sites/465/2021/03/organic-products-hero.png'
							alt='logo'
							className='w-full h-full object-cover'
						/>
					</div>
					{/* text  */}
					<div className='self-center basis-1/2 flex flex-col justify-center px-16'>
						{/* pre img  */}
						<img
							src='https://websitedemos.net/organic-shop-02/wp-content/uploads/sites/465/2019/07/logo-leaf-new.png'
							alt='leave'
							className='w-16'
						/>
						<h3 className='pre-title font-medium mb-0'>
							Best Quality Products
						</h3>
						<h1 className='text-[52px] font-bold !text-slate-800'>
							Join The Organic Movement!
						</h1>
						<p className='text-[18px] mb-5 text-slate-500'>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
							tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Banner;
