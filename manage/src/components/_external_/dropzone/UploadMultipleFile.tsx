import { ReactNode } from 'react';
import styled from 'styled-components';
import { Typography, Tag} from 'antd';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
// utils
import { humanFileSize } from '../../../utils/formatNumber';
import { distinguishImage } from '../../../utils/formatImage';
import { UploadFileType } from '../../../models';
import { CloseCircleFilled, UploadOutlined } from '@ant-design/icons';

const { Text } = Typography;
interface UploadMultipleFileProps extends DropzoneOptions {
  files: UploadFileType[];
  caption?: ReactNode;
  error?: boolean;
  showRejected?: boolean;
  style?: { [key: string]: string | number };
  onRemove: Function;
  previewRender?: (uploadedFiles: UploadMultipleFileProps['files']) => ReactNode;
}
const UploadMultipleFile = ({
  accept,
  files,
  caption,
  error,
  showRejected,
  style,
  onRemove,
  previewRender,
  ...others
}: UploadMultipleFileProps) => {
  const { fileRejections, isDragActive, isDragReject, getRootProps, getInputProps } = useDropzone({
    multiple: true,
    accept,
    ...others,
  });
  const rejectedItems = (
    <div>
      {fileRejections.map(({ file, errors }, index) => {
        const { name, size } = file;
        return (
          <Tag key={index} color="error" style={{ whiteSpace: 'normal' }}>
            <div>
              <Text strong>
                {name} - {humanFileSize(size)}
              </Text>
              <div style={{ paddingLeft: '5px' }}>
                {errors.map((error) => (
                  <Text key={error.code} className="caption">
                    {error.message} <br />
                  </Text>
                ))}
              </div>
            </div>
          </Tag>
        );
      })}
    </div>
  );
  return (
    <>
      <RootStyle
        style={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || fileRejections.length > 0 || error) && { borderColor: 'red' }),
          ...style,
        }}
      >
        <DropzoneStyle {...getRootProps()}>
          <input {...getInputProps()} />
          <PlaceholderStyle className="placeholder">
            <UploadOutlined />
            <Text>Drag 'n' drop some files here, or click to select files</Text>
          </PlaceholderStyle>
        </DropzoneStyle>
      </RootStyle>
      {previewRender && previewRender(files)}
      {!previewRender &&
        files.length > 0 &&
        files.map((file, index) => {
          return (
            file && (
              <Thumb key={index}>
                <ThumbInner>
                  <CloseCircleFilled
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      cursor: 'pointer',
                    }}
                    onClick={() => onRemove(file)}
                  />
                  <img
                    alt=""
                    src={typeof file === 'string' ? distinguishImage(file) : file.preview}
                    style={{ display: 'block', width: 'auto', height: '100%' }}
                  />
                </ThumbInner>
              </Thumb>
            )
          );
        })}
      {caption}
      {showRejected && rejectedItems}
    </>
  );
};
const RootStyle = styled.div({
  width: '100%',
  height: '70px',
  padding: '5px',
  border: '1px dashed rgba(145, 158, 171, 0.32)',
});

const DropzoneStyle = styled.div({
  zIndex: 0,
  position: 'relative',
  width: '100%',
  height: '100%',
  cursor: 'pointer',
  display: 'flex',
  '& > *': {
    width: '100%',
    height: '100%',
  },
  '&:hover > .placeholder': {
    zIndex: 2,
  },
});
const PlaceholderStyle = styled.div({
  position: 'absolute',
  color: 'rgb(99, 115, 129)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgb(244, 246, 248)',
  '&:hover': { opacity: 0.72 },
});

const Thumb = styled('div')({
  position: 'relative',
  marginTop: 16,
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box',
});

const ThumbInner = styled('div')({
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
});
export default UploadMultipleFile;
