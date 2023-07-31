import Image from "next/image";

const ButtonAnimation = (
	{ 
		imageUrl='', 
		handleRefreshClick= () => {},
		cancelActive=false,
		refreshImage= ''
	}
	:
	{
		imageUrl: string,
		handleRefreshClick: any,
		cancelActive: boolean
		refreshImage: any
	}) => (
	<div className="self-center mt-2 duration-500">
		{
			imageUrl &&
			<button
				className="active:animate-spin  1s origin-[50%_50%]"
				color="bg-mauve"
				id="Refresh2FA"
				onClick={handleRefreshClick}
				disabled={cancelActive}>
				<Image src={refreshImage}
					alt="refresh"
					width={30}
					height={30}
					className="m-2 rounded-[inherit]"
				/>
			</button>
		}
	</div>
);

export default ButtonAnimation;