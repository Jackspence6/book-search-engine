// Imports
import { gql } from "@apollo/client";

// Exports
export const GET_ME = gql`
	{
		me {
			_id
			username
			email
			savedBooks {
				bookId
				authors
				image
				description
				title
				link
			}
		}
	}
`;
