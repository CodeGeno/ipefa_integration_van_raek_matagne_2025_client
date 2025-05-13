import { Button } from "@/components/ui";
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogCancel,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogFooter,
} from "@/components/ui/alert-dialog";

const CustomAlertDialog = ({
	title,
	description,
	children,
	actionButtonAction,
	className,
}: {
	children: React.ReactNode;
	title: string;
	description: string;
	actionButtonAction: () => void;
	className?: string;
}) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger
				asChild
				className={className}
			>
				{children}
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>
						{description}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Annuler</AlertDialogCancel>
					<AlertDialogAction onClick={actionButtonAction}>
						Continuer
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default CustomAlertDialog;
