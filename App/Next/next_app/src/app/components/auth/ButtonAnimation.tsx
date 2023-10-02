import Image from "next/image";

const ButtonAnimation = (
	{ 
		imageUrl='', 
		handleRefreshClick= () => {},
		refreshImage= '',
		disable=false
	}
	:
	{
		imageUrl: string,
		handleRefreshClick: any,
		refreshImage: any,
		disable: boolean
	}) => (
	<div className="self-center mt-2 duration-500">
		{
			imageUrl &&
			<button
				className="active:animate-spin  1s origin-[50%_50%]"
				color="bg-mauve"
				id="Refresh2FA"
				onClick={handleRefreshClick}
				disabled={disable}>
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