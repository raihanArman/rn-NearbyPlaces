// components/RNImage.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ImageProps,
    ImageResizeMode,
    ImageSourcePropType,
    ImageStyle,
    StyleProp,
    StyleSheet,
    View,
    Animated,
} from 'react-native';

type LoadState = 'idle' | 'loading' | 'loaded' | 'error';

export interface RNImageProps {
    uri?: string;
    source?: ImageSourcePropType;
    placeholder?: ImageSourcePropType;
    errorImage?: ImageSourcePropType;
    style?: StyleProp<ImageStyle>;
    resizeMode?: ImageResizeMode;
    showIndicator?: boolean;
    onLoaded?: () => void;
    onFailed?: (e?: unknown) => void;
}

const RNImage: React.FC<RNImageProps> = ({
    uri,
    source,
    placeholder,
    errorImage,
    style,
    resizeMode = 'cover',
    showIndicator = true,
    onLoaded,
    onFailed,
}) => {
    const [state, setState] = useState<LoadState>('idle');
    const opacity = useRef(new Animated.Value(0)).current;

    const resolvedSource: ImageProps['source'] | undefined = useMemo(() => {
        if (source) return source;
        if (uri) return { uri };
        return undefined;
    }, [source, uri]);

    useEffect(() => {
        setState('loading');
        if (uri) Image.prefetch(uri).catch(() => { });
    }, [uri, source]);

    const handleLoad = () => {
        Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }).start();
        setState('loaded');
        onLoaded?.();
    };

    const handleError = (e: any) => {
        setState('error');
        onFailed?.(e);
    };

    const renderPlaceholder = () => {
        if (placeholder) {
            return <Image source={placeholder} style={[styles.fill, style as any]} resizeMode={resizeMode} />;
        }
        return <View style={[styles.fill, style as any, styles.defaultPlaceholder]} />;
    };

    const renderError = () => {
        return <Image source={require('../assets/images/error.png')} style={[styles.fill, style as any]} resizeMode="cover" />;
    };

    return (
        <View style={[styles.container, style as any, styles.border]}>
            {(state === 'idle' || state === 'loading') && renderPlaceholder()}

            {resolvedSource && state !== 'error' && (
                <Animated.Image
                    source={resolvedSource}
                    style={[styles.fill, style as any, { opacity }]}
                    resizeMode={resizeMode}
                    onLoad={handleLoad}
                    onError={handleError}
                    // Pastikan memicu load walau invisible
                    onLoadStart={() => setState('loading')}
                />
            )}

            {state === 'error' && renderError()}

            {showIndicator && (state === 'idle' || state === 'loading') && (
                <View style={styles.indicator}>
                    <ActivityIndicator />
                </View>
            )}
        </View>
    );
};

export default RNImage;

const styles = StyleSheet.create({
    container: { position: 'relative', overflow: 'hidden' },
    fill: { width: '100%', height: '100%' },
    indicator: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        alignItems: 'center', justifyContent: 'center',
    },
    defaultPlaceholder: { backgroundColor: '#E5E7EB' }, // gray-200
    defaultError: { backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center' }, // red-100
    border: { borderRadius: 12 },
});
