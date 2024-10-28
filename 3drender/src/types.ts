import { StackScreenProps } from "@react-navigation/stack";

export type RootStackParamList = {
	Home: undefined;
	GlbModelViewer: undefined;
	StlModelViewer: undefined;
};

export type HomeScreenProps = StackScreenProps<RootStackParamList, "Home">;
export type GlbModelViewerProps = StackScreenProps<RootStackParamList, "GlbModelViewer">;
export type StlModelViewerProps = StackScreenProps<RootStackParamList, "StlModelViewer">;
