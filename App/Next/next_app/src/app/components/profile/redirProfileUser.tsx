import Router from 'next/router';

const redirProfileUser = ( userId: number) => {
	Router.push(
		{
			pathname: '/profile',
			query: { userId },
		},
	);
}

export default redirProfileUser;